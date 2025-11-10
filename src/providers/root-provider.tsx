'use client';

import { AuthContextProvider } from "@/contexts/auth-context";
import { DefaultContextProvider } from "@/contexts/defaults-context";
import Loader from "@/components/common/loader";
import { useSupabaseClient } from "@/hooks/use-supabase-client";

function RootProvider({ children }: { children: React.ReactNode }) {
    const supabase = useSupabaseClient();

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
