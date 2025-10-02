'use client';

import { useEffect, useState } from "react";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AuthContextProvider } from "./providers/auth-provider";
import { DefaultContextProvider } from "./providers/default-provider";
import LoginPage from "@/app/login/page";

function RootProvider({ children }: { children: React.ReactNode }) {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    useEffect(() => {
        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Missing Supabase URL or Anon Key");
            return;
        }

        setSupabase(createClient(supabaseUrl, supabaseAnonKey));
    }, [supabaseUrl, supabaseAnonKey]);

    if (!supabase) {
        return <LoginPage />
    }

    return (
        <AuthContextProvider supabase={supabase}>
            <DefaultContextProvider supabase={supabase}>
                {children}
            </DefaultContextProvider>
        </AuthContextProvider>
    );
}

export default RootProvider;
