import { SupabaseClient } from "@supabase/supabase-js";

const EquipmentTable = {
    select: async (supabase: SupabaseClient) => {
        return  supabase.from("equipment").select("*").order("name");
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

export { EquipmentTable, SongTable, VenueTable };