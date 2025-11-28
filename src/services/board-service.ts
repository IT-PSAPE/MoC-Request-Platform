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
        song:request_song(*, song(*)),
        venue:request_venue(*, venue(*)),
        item:request_item(*, item(*)),
        assignee:assignee(*, member(*))
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
        priority: request.priority as unknown as Priority,
        status: request.status as unknown as Status,
        type: request.type as unknown as RequestType,
        attachment: request.attachment as Attachment[],
        note: request.note as Note[],
        item: request.item,
        song: request.song,
        venue: request.venue,
        assignee: request.assignee as Assignee[],
    }));

    return requests;
}

export { list };
