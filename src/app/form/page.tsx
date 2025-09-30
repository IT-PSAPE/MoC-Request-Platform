"use client";

import { useRequestFormController } from "@/features/requests/formController";

import StepIndicator from "./components/step-indicator";
import SuccessScreen from "./components/success-screen";
import QuestionForm from "./components/question-form";
import DetailsForm from "./components/details-form";
import FlowForm from "./components/flow-form";

export default function SubmitPage() {
  const controller = useRequestFormController();

  return (
    <div className="mx-auto max-w-7xl w-full py-8 px-4">
      <h1 className="text-2xl font-semibold mb-2">Submit a Request</h1>
      <p className="text-sm text-foreground/80 mb-6">Follow the steps to complete your request.</p>

      {/* Step indicator (clickable for visited steps) */}
      <div className="flex items-center gap-2 mb-6">
        <StepIndicator step={controller.step} maxStepReached={controller.maxStepReached} setStep={controller.setStep} />
        <div className="ml-2 text-xs text-foreground/60">Step {controller.step} of 3</div>
      </div>

      <form onSubmit={controller.onSubmit} className="space-y-6">
        {controller.step === 1 &&
          <QuestionForm
            who={controller.who}
            setWho={controller.setWho}
            what={controller.what}
            setWhat={controller.setWhat}
            whenTxt={controller.whenTxt}
            setWhenTxt={controller.setWhenTxt}
            whereTxt={controller.whereTxt}
            setWhereTxt={controller.setWhereTxt}
            why={controller.why}
            setWhy={controller.setWhy}
            how={controller.how}
            setHow={controller.setHow}
            additionalInfo={controller.additionalInfo}
            setAdditionalInfo={controller.setAdditionalInfo}
            priority={controller.priority}
            setPriority={controller.setPriority}
            attachments={controller.attachments}
            setAttachments={controller.setAttachments}
            validateStep1={controller.validateStep1}
            resetForm={controller.resetForm}
            setStep={controller.setStep}
            setMaxStepReached={controller.setMaxStepReached}
          />
        }

        {controller.step === 2 &&
          <DetailsForm
            type={controller.type}
            setType={controller.setType}
            due={controller.due}
            setDue={controller.setDue}
            deadlineWarning={controller.deadlineWarning}
            setStep={controller.setStep}
            setMaxStepReached={controller.setMaxStepReached}
            selectedEquipment={controller.selectedEquipment}
            selectedSongs={controller.selectedSongs}
            toggleEquipment={controller.toggleEquipment}
            setEquipmentQuantity={controller.setEquipmentQuantity}
            toggleSong={controller.toggleSong}
          />
        }

        {controller.step === 3 &&
          <FlowForm
            eventFlow={controller.eventFlow}
            addFlowStep={controller.addFlowStep}
            removeFlowStep={controller.removeFlowStep}
            updateFlowLabel={controller.updateFlowLabel}
            setStep={controller.setStep}
          />
        }
      </form>

      {/* Success screen */}
      {controller.submitted && <SuccessScreen submitted={controller.submitted} resetForm={controller.resetForm} />}
    </div>
  );
}
