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

async function create(supabase: SupabaseClient, request: FormRequest): Promise<FetchRequest> {
    const { data, error } = await supabase.from('request').insert(request);
    if (error || !data) {
        console.error("Failed to create request", error);
        throw error;
    }

    return data[0] as FetchRequest;
}


const RequestService = {
    list: list,
    get: get,
    updateStatus: updateStatus,
    addNote: addNote,
    create: create
};

export default RequestService;
