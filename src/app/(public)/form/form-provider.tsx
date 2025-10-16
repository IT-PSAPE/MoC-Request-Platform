'use client';

import { useDefaultContext } from "@/components/providers/default-provider";
import { RequestItemTable, SongTable, VenueTable } from "@/lib/database";
import { createContext, Dispatch, FormEventHandler, SetStateAction, useContext, useEffect, useState } from "react";
import FormService from "./form-service";

type FormSteps = 1 | 2 | 3;

type FormContextType = {
    request: FormRequest
    step: FormSteps,
    songs: Song[]
    venues: Venue[]
    items: RequestItem[]
    isProcessing: boolean
    submitted: string | null
    setStep: Dispatch<SetStateAction<FormSteps>>
    setRequest: Dispatch<SetStateAction<FormRequest>>
    onSubmit: FormEventHandler<HTMLFormElement>
    setIsProcessing: Dispatch<SetStateAction<boolean>>
    setSubmitted: Dispatch<SetStateAction<string | null>>
    reset: () => void
    submit: () => void
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
    equipments: [],
    attachments: [],
    songs: [],
    venues: [],
    items: [],
}

export function FormContextProvider({ children }: { children: React.ReactNode }) {
    const { supabase, statuses } = useDefaultContext();

    const [request, setRequest] = useState<FormRequest>(emptyRequest)
    const [step, setStep] = useState<FormSteps>(1);

    const [songs, setSongs] = useState<Song[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [items, setItems] = useState<RequestItem[]>([]);

    const [submitted, setSubmitted] = useState<string | null>(null);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

    function reset() {
        setRequest(emptyRequest);
        setStep(1);
    }

    async function submit() {
        setIsProcessing(true);

        setSubmitted(await FormService.create(request, statuses, supabase));

        setIsProcessing(false);
    }

    const context = {
        request,
        step,
        songs,
        venues,
        items,
        isProcessing,
        submitted,
        setSubmitted,
        onSubmit,
        setStep,
        setRequest,
        reset,
        submit,
        setIsProcessing,
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