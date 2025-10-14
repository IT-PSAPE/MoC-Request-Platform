'use client';

import { createContext, Dispatch, FormEventHandler, SetStateAction, useContext, useState } from "react";

type FormSteps = 1 | 2 | 3;

type FormContextType = {
    request: FormRequest
    step: FormSteps,
    setStep: Dispatch<SetStateAction<FormSteps>>
    setRequest: Dispatch<SetStateAction<FormRequest>>
    onSubmit: FormEventHandler<HTMLFormElement>
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
    const [request, setRequest] = useState<FormRequest>(emptyRequest)
    const [step, setStep] = useState<FormSteps>(1);

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

    }

    const context = {
        request,
        step,
        onSubmit,
        setStep,
        setRequest,
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