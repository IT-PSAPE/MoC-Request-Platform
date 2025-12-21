'use client';

import Button from "@/components/common/controls/button";
import FirstForm from "./components/steps/first-form";
import SecondForm from "./components/steps/second-form";
import ThirdForm from "./components/steps/third-form";
import Divider from "@/components/common/divider";
import { useFormContext } from "@/components/contexts/form-context";
import StepIndicator from "./components/step-indicator";
import { useEffect } from "react";

import Text from "@/components/common/text";
import SuccessScreen from "./components/success-card";
import FormProcessing from "./components/form-processing";
import InlineAlert from "@/components/common/inline-alert";


export default function RequestForm() {
    const {
        request,
        onSubmit,
        step,
        setStep,
        reset,
        submit,
        submitted,
        isProcessing,
        submissionError,
        setSubmissionError
    } = useFormContext();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    function handlePrimaryAction() {
        switch (step) {
            case 1:
                setStep(2);
                break;
            case 2:
                setStep(3);
                break;
            case 3:
                setSubmissionError(null);
                submit();
                break;
        }
    }

    function handleSecondaryAction() {
        switch (step) {
            case 1:
                reset();
            case 2:
                setStep(1);
                break;
            case 3:
                setStep(2);
                break;
        }
    }

    function handleButtonDisability() {
        switch (step) {
            case 1:
                return request.who.length === 0 || request.what.length === 0 || request.when.length === 0 || request.where.length === 0 || request.why.length === 0 || request.how.length === 0;
            case 2:
                return request.priority.length === 0 || request.type.length === 0 || request.due?.length === 0;
            case 3:
                return false;
        }
    }

    // Determine what to show based on current state
    const currentForm = {
        1: <FirstForm />,
        2: <SecondForm />,
        3: <ThirdForm />,
    }[step];

    // Show success screen if submitted
    if (submitted) {
        return (
            <div className="w-full max-w-[1152px] mx-auto py-6 px-4 space-y-8">
                <FormHeader />
                <Divider />
                <SuccessScreen />
            </div>
        );
    }

    // Show processing screen if submitting
    if (isProcessing) {
        return (
            <div className="w-full max-w-[1152px] mx-auto py-6 px-4 space-y-8">
                <FormHeader />
                <Divider />
                <FormProcessing />
            </div>
        );
    }

    // Show normal form with potential error alert
    return (
        <div className="w-full max-w-[1152px] mx-auto py-6 px-4 space-y-8">
            {/* Header */}
            <FormHeader />

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-8">
                <Divider />
                {currentForm}
                <Divider />
            </form>

            <div className="flex justify-end">
                <div className="w-full flex gap-4 max-w-113.5">
                    <Button
                        className="w-full"
                        variant="secondary"
                        onClick={handleSecondaryAction}
                        disabled={isProcessing}
                    >
                        {step === 1 ? 'Reset' : 'Back'}
                    </Button>
                    <Button
                        className="w-full"
                        onClick={handlePrimaryAction}
                        disabled={handleButtonDisability() || isProcessing}
                    >
                        {step === 3 ? 'Submit' : 'Continue'}
                    </Button>
                </div>
            </div>

            {/* Error Alert */}
            {submissionError && (
                <InlineAlert type="error" message={submissionError} description={'An error occurred while submitting your request. Please try again.'}/>
            )}
        </div>
    )
}

function FormHeader() {
    return (
        <div>
            <Text style="title-h5" className="mb-1">Submit a Request</Text>
            <Text style="paragraph-sm" className="text-quaternary mb-8">Follow the steps to complete your request.</Text>
            <StepIndicator />
        </div>
    )
}
