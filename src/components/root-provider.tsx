'use client';

import { useMemo } from "react";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AuthContextProvider } from "./providers/auth-provider";
import { DefaultContextProvider } from "./providers/default-provider";
import Loader from "@/components/ui/loader";

function RootProvider({ children }: { children: React.ReactNode }) {
    const supabase = useMemo<SupabaseClient | null>(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Missing Supabase URL or Anon Key");
            return null;
        }

        return createClient(supabaseUrl, supabaseAnonKey);
    }, []);

    if (!supabase) {
        return <Loader label="Initializing" className="flex-1" />;
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
