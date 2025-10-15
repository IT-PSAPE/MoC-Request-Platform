'use client';

import { useDefaultContext } from "@/components/providers/default-provider";
import { RequestItemTable, SongTable, VenueTable } from "@/lib/database";
import { createContext, Dispatch, FormEventHandler, SetStateAction, useContext, useEffect, useState } from "react";

type FormSteps = 1 | 2 | 3;

type FormContextType = {
    request: FormRequest
    step: FormSteps,
    setStep: Dispatch<SetStateAction<FormSteps>>
    setRequest: Dispatch<SetStateAction<FormRequest>>
    onSubmit: FormEventHandler<HTMLFormElement>
    songs: Song[]
    venues: Venue[]
    items: RequestItem[]
};

export const FormContext = createContext<FormContextType | null>(null);

const emptyRequest: FormRequest = {
    who: '',
    what: '',
    when: '',
    where: '',
    why: '',
    how: '',
    info: '',
    due: '',
    flow: [],
    priority: '',
    status: '',
    type: '',
    equipment: [],
    attachments: [],
    songs: [],
}

export function FormContextProvider({ children }: { children: React.ReactNode }) {
    const { supabase } = useDefaultContext();

    const [request, setRequest] = useState<FormRequest>(emptyRequest)
    const [step, setStep] = useState<FormSteps>(1);

    const [songs, setSongs] = useState<Song[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [items, setItems] = useState<RequestItem[]>([]);

    useEffect(() => {
        let mounted = true;

        async function loadAll() {
            try {
                // fetch in parallel
                const [songRes, venueRes, itemsRes] = await Promise.all([
                    SongTable.select(supabase),
                    VenueTable.select(supabase),
                    RequestItemTable.select(supabase)
                ]);

                if (!mounted) return;

                if (!songRes.error) setSongs(songRes.data);
                if (!venueRes.error) setVenues(venueRes.data);
                if (!itemsRes.error) setItems(itemsRes.data);
            } catch (err) {
                // optional: could log the error or set an error state
                console.error('Failed to load form data', err);
            }
        }

        loadAll();

        return () => { mounted = false; };
    }, [supabase]);


    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

    }

    const context = {
        request,
        step,
        onSubmit,
        setStep,
        setRequest,
        songs,
        venues,
        items,
    };

    return (
        <FormContext.Provider value={context}>
            {children}
        </FormContext.Provider>
    );
}

export function useFormContext() {
    const context = useContext(FormContext);

    if (!context) throw new Error("useFormContext must be used within a FormContextProvider");

    return context;
}

export type { FormSteps }