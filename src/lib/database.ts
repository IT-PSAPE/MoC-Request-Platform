import { SupabaseClient } from "@supabase/supabase-js";

type Val =
  | string        // text, varchar, uuid, date, timestamp (as ISO string), json (as stringified JSON)
  | number        // integer, bigint, numeric, float
  | boolean       // true/false
  | null          // SQL NULL
  | Date          // converted to timestamp
  | object        // JSON/JSONB
  | Val[];        // arrays, e.g. text[], int[], json[]

const EquipmentTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("equipment").select("*").order("name");
    }
}

const SongTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("song").select("*").order("name");
    }
}

const VenueTable = {
    select: async (supabase: SupabaseClient) => {
        return supabase.from("venue").select("*").order("name");
    }
}

const RequestEquipmentTable = {
    update: async (supabase: SupabaseClient, requestId: string, equipmentId: string, update:{ [key: string]: Val } ) => {
        return supabase.from("request_equipment").update(update)
            .eq("request_id", requestId)
            .eq("equipment_id", equipmentId);
    }
}

const RequestSongTable = {
    update: async (supabase: SupabaseClient, requestId: string, songId: string, update:{ [key: string]: Val } ) => {
        return supabase.from("request_song").update(update)
            .eq("request_id", requestId)
            .eq("song_id", songId);
    }
}

export { EquipmentTable, SongTable, VenueTable, RequestEquipmentTable, RequestSongTable };