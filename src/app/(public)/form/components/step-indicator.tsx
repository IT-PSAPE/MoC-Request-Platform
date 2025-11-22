import { cn } from "@/lib/cn";
import { useFormContext } from "@/contexts/form-context";

export default function StepIndicator() {
    const { step } = useFormContext();

    const steps = [1, 2, 3]

    return (
        <div className="flex items-center gap-8 mb-6">
            <div className="h-1.5 w-65 flex gap-2 items-center">
                {
                    steps.map((s) => {
                        return (
                            <div key={s} className={cn("w-full h-full rounded-full", step >= s ? "bg-brand-solid" : "bg-quaternary")}></div>
                        )
                    })
                }
            </div>
            <div className="ml-2 text-xs text-quaternary">Step {step} of {steps.length}</div>
        </div>
    )
}