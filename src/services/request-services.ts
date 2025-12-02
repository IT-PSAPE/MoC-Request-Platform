import { SupabaseClient } from "@supabase/supabase-js";

async function get(supabase: SupabaseClient, requestId: string): Promise<FetchRequest | null> {
    const responce = await supabase.from("request").select(
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
        song:request_song(*, song(*)),
        venue:request_venue(*, venue(*)),
        item:request_item(*, item(*)),
        assignee:assignee(*, member(*))
      `)
        .eq('id', requestId)
        .single();

    if (responce.error) {
        console.error('Error fetching request:', responce.error);
        return null;
    }

    const data: FetchRequest = {
        id: responce.data.id as string,
        who: responce.data.who as string,
        what: responce.data.what as string,
        when: responce.data.when as string,
        where: responce.data.where as string,
        why: responce.data.why as string,
        how: responce.data.how as string,
        info: responce.data.info as string,
        due: responce.data.due as string,
        flow: responce.data.flow as string[],
        created_at: responce.data.created_at as string,
        priority: responce.data.priority as unknown as Priority,
        status: responce.data.status as unknown as Status,
        type: responce.data.type as unknown as RequestType,
        attachment: responce.data.attachment as Attachment[],
        note: responce.data.note as Note[],
        song: responce.data.song,
        venue: responce.data.venue,
        item: responce.data.item,
        assignee: responce.data.assignee as Assignee[],
    };

    return data;
}

export { get };
