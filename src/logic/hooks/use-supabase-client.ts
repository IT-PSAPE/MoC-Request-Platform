'use client';

import { useMemo } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function useSupabaseClient(): SupabaseClient | null {
    return useMemo(() => {
        // Only create client on the browser side to avoid SSR issues with Math.random()
        if (typeof window === 'undefined') {
            return null;
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Missing Supabase URL or Anon Key");
            return null;
        }

        return createClient(supabaseUrl, supabaseAnonKey);
    }, []);
}
