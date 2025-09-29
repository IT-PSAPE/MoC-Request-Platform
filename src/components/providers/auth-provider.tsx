'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

type AuthContextType = {
    authed: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [authed, setAuthed] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const supabase = useMemo<SupabaseClient | null>(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Supabase environment variables are missing.");
            return null;
        }

        try {
            return createClient(supabaseUrl, supabaseAnonKey);
        } catch (error) {
            console.error("Failed to create Supabase client", error);
            return null;
        }
    }, []);

    useEffect(() => {
        if (!supabase) {
            setUser(null);
            setAuthed(false);
            return;
        }

        let isMounted = true;

        const syncSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (!isMounted) return;

                if (error) {
                    console.error("Failed to fetch Supabase session", error);
                    setUser(null);
                    setAuthed(false);
                    return;
                }

                const sessionUser = data?.session?.user ?? null;
                setUser(sessionUser);
                setAuthed(Boolean(sessionUser));
            } catch (error) {
                if (!isMounted) return;
                console.error("Unexpected error fetching Supabase session", error);
                setUser(null);
                setAuthed(false);
            }
        };

        void syncSession();

        return () => {
            isMounted = false;
        };
    }, [supabase]);

    async function login(email: string, password: string) {
        if (!supabase) {
            throw new Error("Supabase client is not configured");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error;

        setUser(data.user);
        setAuthed(true);

        return true;
    }

    async function logout() {
        if (!supabase) {
            throw new Error("Supabase client is not configured");
        }

        const { error } = await supabase.auth.signOut()

        if (error) throw error;

        setUser(null);
        setAuthed(false);
    }

    const context = { authed, user, login, logout };

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuthContext must be used within a AuthContextProvider");

    return context;
}
