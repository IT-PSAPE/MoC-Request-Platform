'use client';

import { AuthContextProvider } from "@/feature/auth/components/auth-context";
import { DefaultContextProvider } from "@/components/contexts/defaults-context";
import { QueryProvider } from "@/components/contexts/query-provider";
import { Loader } from "@/components/ui/common/loader";
import { useSupabaseClient } from "@/logic/hooks/use-supabase-client";

function RootProvider({ children }: { children: React.ReactNode }) {
    const supabase = useSupabaseClient();

    console.log("RootProvider Supabase Client:", supabase ? true : false);

    if (!supabase) {
        return <Loader label="Initializing" className="flex-1" />;
    }

    return (
        <QueryProvider>
            <AuthContextProvider supabase={supabase}>
                <DefaultContextProvider supabase={supabase}>
                    {children}
                </DefaultContextProvider>
            </AuthContextProvider>
        </QueryProvider>
    );
}

export default RootProvider;
