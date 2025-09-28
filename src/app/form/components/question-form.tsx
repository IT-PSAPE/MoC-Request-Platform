import { Dispatch, SetStateAction } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import Dropzone from "@/components/ui/Dropzone";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { Attachment, RequestPriority } from "@/types/request";

type Props = {
    who: string;
    setWho: Dispatch<SetStateAction<string>>;
    what: string;
    setWhat: Dispatch<SetStateAction<string>>;
    whenTxt: string;
    setWhenTxt: Dispatch<SetStateAction<string>>;
    whereTxt: string;
    setWhereTxt: Dispatch<SetStateAction<string>>;
    why: string;
    setWhy: Dispatch<SetStateAction<string>>;
    how: string;
    setHow: Dispatch<SetStateAction<string>>;
    additionalInfo: string;
    setAdditionalInfo: Dispatch<SetStateAction<string>>;
    priority: RequestPriority;
    setPriority: Dispatch<SetStateAction<RequestPriority>>;
    attachments: Attachment[];
    setAttachments: Dispatch<SetStateAction<Attachment[]>>;
    validateStep1: () => boolean;
    resetForm: () => void;
    setStep: Dispatch<SetStateAction<FormSteps>>;
    setMaxStepReached: Dispatch<SetStateAction<FormSteps>>;

    priorities: { value: RequestPriority; label: string }[];
}

function QuestionForm({ who, setWho, what, setWhat, whenTxt, setWhenTxt, whereTxt, setWhereTxt, why, setWhy, how, setHow, additionalInfo, setAdditionalInfo, priority, setPriority, attachments, setAttachments, validateStep1, resetForm, setStep, setMaxStepReached, priorities }: Props) {
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
                </div>
            </Card>

            <Card>
                <Divider title="Additional Details" />
                <div className="mt-4 space-y-5">
                    {/* Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">Priority</div>
                            <div className="text-xs text-foreground/60">Higher priority may be processed sooner.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">Priority</label>
                            <Select name="priority" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                                {priorities.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </Select>
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
                    <div className="border-b border-foreground/10" />
                    {/* Attachments */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">Attachments</div>
                            <div className="text-xs text-foreground/60">Upload reference files if applicable.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <Dropzone onFiles={(f) => setAttachments((prev) => [...prev, ...f])} />
                            {attachments.length > 0 && (
                                <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                                    {attachments.map((a) => (
                                        <li key={a.id} className="flex items-center justify-between">
                                            <span>
                                                {a.name} <span className="text-foreground/60 text-xs">({Math.round(a.size / 1024)} KB)</span>
                                            </span>
                                            <button
                                                type="button"
                                                className="text-xs text-red-500"
                                                onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== a.id))}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex gap-3">
                <Button
                    type="button"
                    onClick={() => {
                        if (!validateStep1()) return;
                        const next = 2 as const;
                        setStep(next);
                        setMaxStepReached((prev) => (prev < next ? next : prev));
                    }}
                    disabled={!validateStep1()}
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