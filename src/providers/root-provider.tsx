'use client';

import { AuthContextProvider } from "@/contexts/auth-context";
import { DefaultContextProvider } from "@/contexts/defaults-context";
import { QueryProvider } from "@/providers/query-provider";
import { CacheSyncProvider } from "@/providers/cache-sync-provider";
import Loader from "@/components/common/loader";
import { useSupabaseClient } from "@/hooks/use-supabase-client";

function RootProvider({ children }: { children: React.ReactNode }) {
    const supabase = useSupabaseClient();

    if (!supabase) {
        return <Loader label="Initializing" className="flex-1" />;
    }

    return (
        <QueryProvider>
            <AuthContextProvider supabase={supabase}>
                <CacheSyncProvider>
                    <DefaultContextProvider supabase={supabase}>
                        {children}
                    </DefaultContextProvider>
                </CacheSyncProvider>
            </AuthContextProvider>
        </QueryProvider>
    );
}

export default RootProvider;
