"use client";

import { useRequestFormController } from "@/features/requests/formController";

import StepIndicator from "./components/step-indicator";
import SuccessScreen from "./components/success-screen";
import QuestionForm from "./components/question-form";
import DetailsForm from "./components/details-form";
import FlowForm from "./components/flow-form";

export default function SubmitPage() {
  const { step, maxStepReached, setStep, submitted, onSubmit } = useRequestFormController();

  return (
    <div className="mx-auto max-w-7xl w-full py-8 px-4">
      <h1 className="text-2xl font-semibold mb-2">Submit a Request</h1>
      <p className="text-sm text-foreground/80 mb-6">Follow the steps to complete your request.</p>

      {/* Step indicator (clickable for visited steps) */}
      <div className="flex items-center gap-2 mb-6">
        <StepIndicator step={step} maxStepReached={maxStepReached} setStep={setStep} />
        <div className="ml-2 text-xs text-foreground/60">Step {step} of 3</div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        {step === 1 && <QuestionForm />}
        {step === 2 && <DetailsForm />}
        {step === 3 && <FlowForm />}
      </form>

      {/* Success screen */}
      {submitted && <SuccessScreen />}
    </div>
  );
}
