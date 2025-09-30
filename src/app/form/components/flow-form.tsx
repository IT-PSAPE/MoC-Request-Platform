import { Dispatch, SetStateAction } from "react";

import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { EventFlowStep } from "@/types/request";

type Props = {
    eventFlow: EventFlowStep[];
    addFlowStep: (type: "segment" | "song") => void;
    removeFlowStep: (id: string) => void;
    updateFlowLabel: (id: string, label: string) => void;
    updateFlowSong: (id: string, songId: string) => void;

    setStep: Dispatch<SetStateAction<FormSteps>>
}

function FlowForm({ eventFlow, addFlowStep, removeFlowStep, updateFlowLabel, updateFlowSong, setStep }: Props) {
    return (
        <>
            <Card>
                <Divider title="Event Flow (optional)" />
                <div className="mt-4 space-y-3">
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => addFlowStep("segment")}>Add Segment</Button>
                        <Button type="button" variant="secondary" onClick={() => addFlowStep("song")}>Add Song</Button>
                    </div>
                    <div className="space-y-2">
                        {eventFlow.map((s) => (
                            <div key={s.id} className="rounded-md border border-foreground/20 p-2">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs text-foreground/60">Step {s.order} • {s.type}</div>
                                    <button
                                        type="button"
                                        className="text-xs text-red-500"
                                        onClick={() => removeFlowStep(s.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                                    <div className="sm:col-span-2 text-xs text-foreground/60">Label</div>
                                    <div className="sm:col-span-3">
                                        <Input value={s.label} onChange={(e) => updateFlowLabel(s.id, e.target.value)} />
                                    </div>
                                </div>
                                {s.type === "song" && (
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                                        <div className="sm:col-span-2 text-xs text-foreground/60">Song</div>
                                        <div className="sm:col-span-3">
                                            <Select value={s.songId || ""} onChange={(e) => updateFlowSong(s.id, e.target.value)}>
                                                <option value="">Select a song...</option>
                                                {songsCatalog.filter((x) => x.available).map((x) => (
                                                    <option key={x.id} value={x.id}>
                                                        {x.title} {x.artist ? `• ${x.artist}` : ""}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                </Button>
                <Button type="submit">Submit Request</Button>
            </div>
        </>
    )
}

export default FlowForm;
