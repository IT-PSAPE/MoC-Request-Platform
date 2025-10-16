import { SupabaseClient } from "@supabase/supabase-js";

type Val =
  | string        // text, varchar, uuid, date, timestamp (as ISO string), json (as stringified JSON)
  | number        // integer, bigint, numeric, float
  | boolean       // true/false
  | null          // SQL NULL
  | Date          // converted to timestamp
  | object        // JSON/JSONB
  | Val[];        // arrays, e.g. text[], int[], json[]

const RequestItemTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("request_item").select("*").order("name");
    }
}

const EquipmentTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("equipment").select("*").order("name");
    },
    update: async (supabase: SupabaseClient, equipmentId: string, update:{ [key: string]: Val } ) => {
        return supabase.from("equipment").update(update)
            .eq("id", equipmentId);
    }
}

const SongTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("song").select("*").order("name");
    },
    update: async (supabase: SupabaseClient, songId: string, update:{ [key: string]: Val } ) => {
        return supabase.from("song").update(update)
            .eq("id", songId);
    }
}

const VenueTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("venue").select("*").order("name");
    },
    update: async (supabase: SupabaseClient, venueId: string, update:{ [key: string]: Val } ) => {
        return supabase.from("venue").update(update)
            .eq("id", venueId);
    }
}

const RequestSongTable = {
    update: async (supabase: SupabaseClient, requestId: string, songId: string, update:{ [key: string]: Val } ) => {
        return supabase.from("request_song").update(update)
            .eq("request_id", requestId)
            .eq("song_id", songId);
    }
}

export { EquipmentTable, SongTable, VenueTable, RequestSongTable, RequestItemTable };