import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

type CellData =
    | string        // text, varchar, uuid, date, timestamp (as ISO string), json (as stringified JSON)
    | number        // integer, bigint, numeric, float
    | boolean       // true/false
    | null          // SQL NULL
    | Date          // converted to timestamp
    | object        // JSON/JSONB
    | CellData[];        // arrays, e.g. text[], int[], json[]

export const RequestItemTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("item").select("*").order("name");
    }
}

export const EquipmentTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("equipment").select("*").order("name");
    },
    update: async (supabase: SupabaseClient, equipmentId: string, update: { [key: string]: CellData }) => {
        return supabase.from("equipment").update(update)
            .eq("id", equipmentId);
    }
}

export const SongTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("song").select("*").order("name");
    },
    update: async (supabase: SupabaseClient, songId: string, update: { [key: string]: CellData }) => {
        return supabase.from("song").update(update)
            .eq("id", songId);
    }
}

export const VenueTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("venue").select("*").order("name");
    },
    update: async (supabase: SupabaseClient, venueId: string, update: { [key: string]: CellData }) => {
        return supabase.from("venue").update(update)
            .eq("id", venueId);
    }
}

export const RequestSongTable = {
    update: async (supabase: SupabaseClient, requestId: string, songId: string, update: { [key: string]: CellData }) => {
        return supabase.from("request_song").update(update)
            .eq("request_id", requestId)
            .eq("song_id", songId);
    }
}

export const RequestTable = {
    list: async (supabase: SupabaseClient) => {
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
            song: request.song,
            venue: request.venue,
            item: request.item,
            assignee: request.assignee as Assignee[],
        }));

        return requests;
    },
    select: async (supabase: SupabaseClient) => {
        return supabase.from("request").select(
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
    },
    get: async (supabase: SupabaseClient, requestId: string): Promise<{ data: FetchRequest | null, error: PostgrestError | null }> => {
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
            return { data: null, error: responce.error };
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

        return { data, error: null };
    },
    delete: async (supabase: SupabaseClient, requestId: string): Promise<{ error: PostgrestError | null }> => {
        const { error } = await supabase
            .from("request")
            .delete()
            .eq("id", requestId);

        return { error };
    },
    update: async (supabase: SupabaseClient, requestId: string, payload: { [key: string]: CellData }): Promise<{ error: PostgrestError | null }> => {
        const { error } = await supabase
            .from("request")
            .update(payload)
            .eq("id", requestId);

        return { error };
    }
}

export const StatusTable = {
    list: async (supabase: SupabaseClient): Promise<{ data: Status[] | null, error: PostgrestError | null }> => {
        return supabase.from("status").select("*").order("value", { ascending: true });
    }
};


export const PriorityTable = {
    list: async (supabase: SupabaseClient): Promise<{ data: Priority[] | null, error: PostgrestError | null }> => {
        return supabase.from("priority").select("*").order("value", { ascending: true });
    }
};

export const RequestTypeTable = {
    list: async (supabase: SupabaseClient): Promise<{ data: RequestType[] | null, error: PostgrestError | null }> => {
        return supabase.from("request_type").select("*");
    }
};

export const MembersTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("member").select("*").order("name");
    }
}
