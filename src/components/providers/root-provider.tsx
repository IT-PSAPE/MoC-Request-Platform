'use client';

import { AuthContextProvider } from "@/components/contexts/auth-context";
import { DefaultContextProvider } from "@/components/contexts/defaults-context";
import { QueryProvider } from "@/components/providers/query-provider";
import { CacheSyncProvider } from "@/components/providers/cache-sync-provider";
import Loader from "@/components/common/loader";
import { useSupabaseClient } from "@/logic/hooks/use-supabase-client";

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
