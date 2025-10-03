type Props = {
    step: FormSteps;
    maxStepReached: FormSteps;
    setStep: (step: FormSteps) => void;
}

function StepIndicator({ step, maxStepReached, setStep }: Props) {
    return [1, 2, 3].map((s) => {
        const reached = (maxStepReached as FormSteps) >= (s as FormSteps);
        const active = (step as FormSteps) >= (s as FormSteps);
        return (
            <button
                type="button"
                key={s}
                onClick={() => reached && setStep(s as FormSteps)}
                className={`h-2 rounded-full ${active ? "bg-foreground/80" : "bg-foreground/20"} ${reached ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                    }`}
                aria-label={`Go to step ${s}`}
                disabled={!reached}
            />
        );
    });
}

export default StepIndicator;