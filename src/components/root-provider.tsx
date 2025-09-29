'use client';

import { useEffect, useState } from "react";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AuthContextProvider } from "./providers/auth-provider";
import { DefualtContextProvider } from "./providers/defualt-provider";

function RootProvider({ children }: { children: React.ReactNode }) {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

    useEffect(() => {
        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Missing Supabase URL or Anon Key");
            return;
        }

        setSupabase(createClient(supabaseUrl, supabaseAnonKey));
    }, []);

    if (!supabase) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContextProvider supabase={supabase}>
            <DefualtContextProvider supabase={supabase}>
                {children}
            </DefualtContextProvider>
        </AuthContextProvider>
    );
}

export default RootProvider;