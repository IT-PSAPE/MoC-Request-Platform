'use client';

import Button from "@/components/ui/Button";
import FirstForm from "./content/first-form";
import SecondForm from "./content/second-form";
import FormThree from "./content/third-form";
import Divider from "./divider";
import { useFormContext } from "./form-provider";
import StepIndicator from "./step-indicator";

import Text from "@/components/ui/text";


export default function Form() {
    const { request, onSubmit, step, setStep } = useFormContext();

    function handlePrimaryAction() {
        switch (step) {
            case 1:
                setStep(2);
                break;
            case 2:
                setStep(3);
                break;
            case 3:
                break;
        }
    }

    function handleSecondaryAction() {
        switch (step) {
            case 1:
                break;
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

    const currentForm = {
        1: <FirstForm />,
        2: <SecondForm />,
        3: <FormThree />,
    }[step];


    return (
        <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8">
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
                    <Button className="w-full" variant="secondary" onClick={handleSecondaryAction} >
                        {step === 1 ? 'Reset' : 'Back'}
                    </Button>
                    <Button className="w-full" onClick={handlePrimaryAction} disabled={handleButtonDisability()} >
                        {step === 3 ? 'Submit' : 'Continue'}
                    </Button>
                </div>
            </div>
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