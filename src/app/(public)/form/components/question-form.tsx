import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import type { RequestFormController } from "@/features/requests/formController";

type Props = {
    controller: RequestFormController;
};

function QuestionForm({ controller }: Props) {
    const {
        who,
        setWho,
        what,
        setWhat,
        whenTxt,
        setWhenTxt,
        whereTxt,
        setWhereTxt,
        why,
        setWhy,
        how,
        setHow,
        additionalInfo,
        setAdditionalInfo,
        validateStep1,
        resetForm,
        setStep,
        setMaxStepReached,
    } = controller;

    const canContinue = validateStep1();

    return (
        <>
            <Card>
                <Divider title="5W + 1H" />
                <div className="mt-4 space-y-5">
                    {/* Who */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">Who</div>
                            <div className="text-xs text-foreground/60">Full name or organization.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">Who</label>
                            <Input name="who" value={who} onChange={(e) => setWho(e.target.value)} placeholder="Who is making this request?" required />
                        </div>
                    </div>
                    <div className="border-b border-foreground/10" />
                    {/* What */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">What</div>
                            <div className="text-xs text-foreground/60">Describe the task or deliverable.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">What</label>
                            <Textarea name="what" value={what} onChange={(e) => setWhat(e.target.value)} placeholder="What is being requested?" required />
                        </div>
                    </div>
                    <div className="border-b border-foreground/10" />
                    {/* When */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">When</div>
                            <div className="text-xs text-foreground/60">Deadlines, dates, or time window.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">When</label>
                            <Input name="when" value={whenTxt} onChange={(e) => setWhenTxt(e.target.value)} placeholder="When is it needed?" required />
                        </div>
                    </div>
                    <div className="border-b border-foreground/10" />
                    {/* Where */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">Where</div>
                            <div className="text-xs text-foreground/60">Location or channel.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">Where</label>
                            <Input name="where" value={whereTxt} onChange={(e) => setWhereTxt(e.target.value)} placeholder="Where will it be used or delivered?" required />
                        </div>
                    </div>
                    <div className="border-b border-foreground/10" />
                    {/* Why */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">Why</div>
                            <div className="text-xs text-foreground/60">Goals, context, or problem being solved.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">Why</label>
                            <Textarea name="why" value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Why is this needed?" required />
                        </div>
                    </div>
                    <div className="border-b border-foreground/10" />
                    {/* How */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">How</div>
                            <div className="text-xs text-foreground/60">Constraints, process, or preferred approach.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">How</label>
                            <Textarea name="how" value={how} onChange={(e) => setHow(e.target.value)} placeholder="How should it be done?" required />
                        </div>
                    </div>
                    <div className="border-b border-foreground/10" />
                    {/* Additional Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">Additional Info</div>
                            <div className="text-xs text-foreground/60">Anything else we should know?</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">Additional Info</label>
                            <Textarea name="additionalInfo" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Anything else we should know?" />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex gap-3">
                <Button
                    type="button"
                    onClick={() => {
                        if (!canContinue) return;
                        const next = 2 as const;
                        setStep(next);
                        setMaxStepReached((prev) => (prev < next ? next : prev));

                        console.log("Proceeding to step 2");
                    }}
                    disabled={!canContinue}
                >
                    Continue to Step 2
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                    Reset
                </Button>
            </div>
        </>
    );
}

export default QuestionForm;
