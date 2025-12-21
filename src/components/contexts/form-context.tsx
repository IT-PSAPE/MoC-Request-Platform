'use client';

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, FormEventHandler } from "react";
// Types are global from @/lib/type.ts - no import needed
import FormService from "@/logic/services/form-service";
import { sendTelegramNotification } from '@/logic/services/telegram-service';
import { useDefaultContext } from "@/components/contexts/defaults-context";
import { SongTable, VenueTable, RequestItemTable } from "@/lib/database";

type FormSteps = 1 | 2 | 3;

type FormContextType = {
    request: FormRequest
    step: FormSteps,
    songs: Song[]
    venues: Venue[]
    items: RequestItem[]
    isProcessing: boolean
    submitted: string | null
    submissionError: string | null
    noticeAlert: string | null
    setStep: Dispatch<SetStateAction<FormSteps>>
    setRequest: Dispatch<SetStateAction<FormRequest>>
    onSubmit: FormEventHandler<HTMLFormElement>
    setIsProcessing: Dispatch<SetStateAction<boolean>>
    setSubmitted: Dispatch<SetStateAction<string | null>>
    setSubmissionError: Dispatch<SetStateAction<string | null>>
    reset: () => void
    submit: () => void
    checkNoticePeriod: (types: { id: string; notice?: number; warning?: string }[]) => void
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
    const { supabase, statuses, priorities, types } = useDefaultContext();

    const [request, setRequest] = useState<FormRequest>(emptyRequest)
    const [step, setStep] = useState<FormSteps>(1);

    const [songs, setSongs] = useState<Song[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [items, setItems] = useState<RequestItem[]>([]);

    const [submitted, setSubmitted] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [noticeAlert, setNoticeAlert] = useState<string | null>(null);

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

    function checkNoticePeriod(types: { id: string; notice?: number; warning?: string }[]) {
        if (!request.due || !request.type) {
            setNoticeAlert(null);
            return;
        }
        
        const selectedType = types.find(t => t.id === request.type);
        if (!selectedType?.notice) {
            setNoticeAlert(null);
            return;
        }
        
        const dueDate = new Date(request.due);
        const now = new Date();
        const noticeHours = selectedType.notice * 24; // Convert days to hours
        
        // Calculate difference in hours
        const diffHours = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        if (diffHours < noticeHours) {
            setNoticeAlert(selectedType.warning || 'The selected due date does not meet the required notice period for this request type.');
        } else {
            setNoticeAlert(null);
        }
    }

    function reset() {
        setRequest(emptyRequest);
        setSubmitted(null);
        setSubmissionError(null);
        setStep(1);
        setNoticeAlert(null);
    }

    async function submit() {
        setIsProcessing(true);
        setSubmissionError(null); // Clear any previous errors

        try {
            // Use sandbox or real service based on mode
            const service = FormService;
            const requestId = await service.create(request, statuses, supabase);
            setSubmitted(requestId);
            
            // Send Telegram notification (non-blocking)
            const priorityName = priorities.find(p => p.id === request.priority)?.name || 'Unknown';
            const typeName = types.find(t => t.id === request.type)?.name || 'Unknown';
            
            sendTelegramNotification({
                id: requestId,
                what: request.what,
                type: typeName,
                priority: priorityName,
                due: request.due || null
            }).catch(error => {
                console.warn('Telegram notification failed:', error);
                // Don't fail the form submission if notification fails
            });
        } catch (error) {
            console.error('Form submission failed:', error);
            setSubmissionError(
                error instanceof Error 
                    ? error.message 
                    : 'An unexpected error occurred while submitting your request. Please try again.'
            );
        } finally {
            setIsProcessing(false);
        }
    }

    const context = {
        request,
        step,
        songs,
        venues,
        items,
        isProcessing,
        submitted,
        submissionError,
        noticeAlert,
        setSubmitted,
        setSubmissionError,
        onSubmit,
        setStep,
        setRequest,
        reset,
        submit,
        setIsProcessing,
        checkNoticePeriod,
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