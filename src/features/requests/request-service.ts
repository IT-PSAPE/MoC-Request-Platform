import { SupabaseClient } from "@supabase/supabase-js";

async function list(supabase: SupabaseClient): Promise<FetchRequest[]> {
    const data = await supabase.from("request").select(
        ` id,
        who,
        what,
        when,
        where,
        why,
        how,
        info,
        due,
        flow,
        created_at,
        priority(*),
        status(*),
        type(*),
        attachment(*),
        note(*),
        equipment:request_equipment(*, equipment(*)),
        song:request_song(*, song(*)),
        venue:request_venue(*, venue(*))
      `);

    if (data.error) {
        console.error("Failed to load requests", data.error);
        return [];
    }

    const requests = data.data.map((request) => ({
        id: request.id as string,
        who: request.who as string,
        what: request.what as string,
        when: request.when as string,
        where: request.where as string,
        why: request.why as string,
        how: request.how as string,
        info: request.info as string,
        due: request.due as string,
        flow: request.flow as string[],
        created_at: request.created_at as string,
        // @ts-ignore
        priority: request.priority as Priority,
        // @ts-ignore
        status: request.status as Status,
        // @ts-ignore
        type: request.type as RequestType,
        attachment: request.attachment as Attachment[],
        note: request.note as Note[],
        equipment: request.equipment,
        song: request.song,
        venue: request.venue,
    }));
    
    return requests;
}

async function get(supabase: SupabaseClient, id: string): Promise<FetchRequest | null> {
    const data = await supabase.from("request").select(
        ` id,
        who,
        what,
        when,
        where,
        why,
        how,
        info,
        due,
        flow,
        created_at,
        priority(*),
        status(*),
        type(*),
        attachment(*),
        note(*),
        equipment:request_equipment(*, equipment(*)),
        song:request_song(*, song(*)),
        venue:request_venue(*, venue(*))
      `).eq("id", id);

    if (data.error) {
        console.error("Failed to load request", data.error);
        return null;
    }

    const request = data.data[0];
    if (!request) return null;

    return {
        id: request.id as string,
        who: request.who as string,
        what: request.what as string,
        when: request.when as string,
        where: request.where as string,
        why: request.why as string,
        how: request.how as string,
        info: request.info as string,
        due: request.due as string,
        flow: request.flow as string[],
        created_at: request.created_at as string,
        // @ts-ignore
        priority: request.priority as Priority,
        // @ts-ignore
        status: request.status as Status,
        // @ts-ignore
        type: request.type as RequestType,
        attachment: request.attachment as Attachment[],
        note: request.note as Note[],
        equipment: request.equipment,
        song: request.song,
        venue: request.venue,
    };
}

async function updateStatus(supabase: SupabaseClient, id: string, status: Status): Promise<void> {
    const { error } = await supabase.from("request").update({ status: status.id }).eq("id", id);
    if (error) {
        console.error("Failed to update request status", error);
    }
}

async function addNote(supabase: SupabaseClient, id: string, note: string): Promise<void> {
    const user = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('note').insert({ request: id, author: user.data.user?.id, note: note });
}

type CreateRequestParams = {
    supabase: SupabaseClient;
    request: BaseRequest;
    attachments: Attachment[];
    songs: RequestSong[];
    venues: RequestVenue[];
    equipment: RequestEquipment[];
};

async function create({ supabase, request, attachments, songs, venues, equipment }: CreateRequestParams): Promise<FetchRequest> {
    const { data, error } = await supabase.from('request').insert(request).select('id');

    if (error) {
        throw new Error('Failed to create request: ' + error.message);
    }

    const insertedRequests = data as { id: string }[] | null;

    if (!insertedRequests || insertedRequests.length === 0) {
        throw new Error('Failed to create request: missing inserted record');
    }

    const requestId = insertedRequests[0].id;

    if (equipment.length > 0) {
        const equipmentToInsert = equipment.map(eq => ({ ...eq, request_id: requestId }));
        const { error: eqError } = await supabase.from('request_equipment').insert(equipmentToInsert);
        if (eqError) {
            console.error('Failed to insert equipment:', eqError);
        }
    }

    if (attachments.length > 0) {
        const attachmentsToInsert = attachments.map(att => ({ ...att, request: requestId }));
        const { error: attError } = await supabase.from('attachment').insert(attachmentsToInsert);
        if (attError) {
            console.error('Failed to insert attachments:', attError);
        }
    }

    if (songs.length > 0) {
        const songsToInsert = songs.map(s => ({ ...s, request_id: requestId }));
        const { error: songError } = await supabase.from('request_song').insert(songsToInsert);
        if (songError) {
            console.error('Failed to insert songs:', songError);
        }
    }

    if (venues.length > 0) {
        const venuesToInsert = venues.map(v => ({ ...v, request_id: requestId }));
        const { error: venueError } = await supabase.from('request_venue').insert(venuesToInsert);
        if (venueError) {
            console.error('Failed to insert venues:', venueError);
        }
    }

    const createdRequest = await get(supabase, requestId);

    if (!createdRequest) {
        throw new Error('Failed to load created request');
    }

    return createdRequest;
}


const RequestService = {
    list: list,
    get: get,
    updateStatus: updateStatus,
    addNote: addNote,
    create: create
};

export default RequestService;
