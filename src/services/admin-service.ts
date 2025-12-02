import { SupabaseClient, PostgrestError } from "@supabase/supabase-js";

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

export { addComment, listMembers, assignMember, unassignMember };
