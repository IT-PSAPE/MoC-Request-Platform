import { SupabaseClient, PostgrestError } from "@supabase/supabase-js";

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
        equipment: request.equipment,
        song: request.song,
        venue: request.venue,
        item: request.item,
        assignee: request.assignee as Assignee[],
    }));

    return requests;
}

async function updateRequestStatus(supabase: SupabaseClient, requestId: string, statusId: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
        .from("request")
        .update({ status: statusId })
        .eq("id", requestId);

    return { error };
}

async function addComment(supabase: SupabaseClient, requestId: string, comment: string, author: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
        .from("note")
        .insert({
            request: requestId,
            note: comment,
            author: author,
        });

    return { error };
}

async function updateRequestPriority(supabase: SupabaseClient, requestId: string, priorityId: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
        .from("request")
        .update({ priority: priorityId })
        .eq("id", requestId);

    return { error };
}

async function updateRequestType(supabase: SupabaseClient, requestId: string, typeId: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
        .from("request")
        .update({ type: typeId })
        .eq("id", requestId);

    return { error };
}

async function updateRequestDueDate(supabase: SupabaseClient, requestId: string, dueDate: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
        .from("request")
        .update({ due: dueDate })
        .eq("id", requestId);

    return { error };
}

async function deleteRequest(supabase: SupabaseClient, requestId: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
        .from("request")
        .delete()
        .eq("id", requestId);

    return { error };
}

async function listMembers(supabase: SupabaseClient): Promise<Member[]> {
    const { data, error } = await supabase
        .from("member")
        .select("*")
        .order("name");

    if (error) {
        console.error("Failed to load members", error);
        return [];
    }

    return data as Member[];
}

async function assignMember(supabase: SupabaseClient, requestId: string, memberId: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
        .from("assignee")
        .insert({
            request_id: requestId,
            member_id: memberId,
        });

    return { error };
}

async function unassignMember(supabase: SupabaseClient, requestId: string, memberId: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
        .from("assignee")
        .delete()
        .eq("request_id", requestId)
        .eq("member_id", memberId);

    return { error };
}

export { list, updateRequestStatus, updateRequestPriority, updateRequestType, updateRequestDueDate, addComment, deleteRequest, listMembers, assignMember, unassignMember };
