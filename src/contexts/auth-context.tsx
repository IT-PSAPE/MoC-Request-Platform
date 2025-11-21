'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { SupabaseClient, User } from '@supabase/supabase-js';

type AuthContextType = {
    authed: boolean;
    user: User | null;
    initialized: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children, supabase }: { children: React.ReactNode, supabase: SupabaseClient }) {
    const [authed, setAuthed] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const syncSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (!isMounted) return;

                if (error) {
                    console.error("Failed to fetch Supabase session", error);
                    setUser(null);
                    setAuthed(false);
                    setInitialized(true);
                    return;
                }

                const sessionUser = data?.session?.user ?? null;
                setUser(sessionUser);
                setAuthed(Boolean(sessionUser));
                setInitialized(true);
            } catch (error) {
                if (!isMounted) return;
                console.error("Unexpected error fetching Supabase session", error);
                setUser(null);
                setAuthed(false);
                setInitialized(true);
            }
        };

        // Initial session sync
        void syncSession();

        // Listen to auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;
            
            console.log('Auth state change:', event, session?.user?.email);
            
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            setAuthed(Boolean(sessionUser));
            setInitialized(true);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    async function login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error;

        setUser(data.user);
        setAuthed(true);
        setInitialized(true);

        return true;
    }

    async function logout() {
        const { error } = await supabase.auth.signOut()

        if (error) throw error;

        setUser(null);
        setAuthed(false);
        setInitialized(true);
    }

    const context: AuthContextType = { authed, user, initialized, login, logout };

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
