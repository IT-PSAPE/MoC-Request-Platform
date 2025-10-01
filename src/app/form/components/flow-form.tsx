import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
// import Select from "@/components/ui/Select";
import { useRequestFormController } from "@/features/requests/formController";


function FlowForm() {
    const {
        eventFlow,
        addFlowStep,
        removeFlowStep,
        updateFlowLabel,
        setStep,
    } = useRequestFormController();

    return (
        <>
            <Card>
                <Divider title="Event Flow (optional)" />
                <div className="mt-4 space-y-3">
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => addFlowStep("segment")}>Add Segment</Button>
                        {/* <Button type="button" variant="secondary" onClick={() => addFlowStep("song")}>Add Song</Button> */}
                    </div>
                    <div className="space-y-2">
                        {eventFlow.map((s, i) => (
                            <div key={i} className="rounded-md border border-foreground/20 p-2">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs text-foreground/60">Step {i + 1}</div>
                                    <button
                                        type="button"
                                        className="text-xs text-red-500"
                                        onClick={() => removeFlowStep(i)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                                    <div className="sm:col-span-2 text-xs text-foreground/60">Label</div>
                                    <div className="sm:col-span-3">
                                        <Input value={s} onChange={(e) => updateFlowLabel(i, e.target.value)} />
                                    </div>
                                </div>
                                {/* {s === "song" && (
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
                                )} */}
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
