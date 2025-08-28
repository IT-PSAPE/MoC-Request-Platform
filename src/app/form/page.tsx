"use client";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Dropzone from "@/components/ui/Dropzone";
import Divider from "@/components/ui/Divider";
import { RequestKind } from "@/types/request";
import { equipmentCatalog, songsCatalog } from "@/features/requests/catalog";
import { useRequestFormController } from "@/features/requests/formController";

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const;

export default function SubmitPage() {
  const router = useRouter();
  const {
    // step control
    step,
    setStep,
    maxStepReached,
    setMaxStepReached,

    // core fields
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
    priority,
    setPriority,
    attachments,
    setAttachments,

    // type and scheduling
    kind,
    setKind,
    dueAt,
    setDueAt,

    // selections
    selectedEquipment,
    selectedSongs,
    toggleEquipment,
    toggleSong,

    // flow
    eventFlow,
    addFlowStep,
    updateFlowLabel,
    updateFlowSong,
    removeFlowStep,

    // helpers
    deadlineWarning,
    validateStep1,
    onSubmit,
    resetForm,

    // submission
    submitted,
  } = useRequestFormController();

  return (
    <div className="mx-auto max-w-7xl w-full py-8 px-4">
      <h1 className="text-2xl font-semibold mb-2">Submit a Request</h1>
      <p className="text-sm text-foreground/80 mb-6">Follow the steps to complete your request.</p>

      {/* Step indicator (clickable for visited steps) */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => {
          const reached = (maxStepReached as number) >= (s as number);
          const active = (step as number) >= (s as number);
          return (
            <button
              type="button"
              key={s}
              onClick={() => reached && setStep(s as 1 | 2 | 3)}
              className={`h-2 rounded-full ${active ? "bg-foreground/80" : "bg-foreground/20"} ${
                reached ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              }`}
              style={{ width: 100 }}
              aria-label={`Go to step ${s}`}
              disabled={!reached}
            />
          );
        })}
        <div className="ml-2 text-xs text-foreground/60">Step {step} of 3</div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {step === 1 && (
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
        )}

        {step === 2 && (
          <>
            <Card>
              <Divider title="Request Type & Due Date" />
              <div className="mt-4 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                  <div className="sm:col-span-2">
                    <div className="text-sm font-medium">Type of Request</div>
                    <div className="text-xs text-foreground/60">Select what you are requesting.</div>
                  </div>
                  <div className="sm:col-span-3">
                    <Select value={kind} onChange={(e) => setKind(e.target.value as RequestKind | "") }>
                      <option value="">Select type...</option>
                      <option value="event">Event</option>
                      <option value="video_editing">Video Editing</option>
                      <option value="video_filming_editing">Video (Filming + Editing)</option>
                      <option value="equipment">Equipment</option>
                      <option value="design_flyer">Design (Flyer)</option>
                      <option value="design_special">Design (Special)</option>
                    </Select>
                  </div>
                </div>
                <div className="border-b border-foreground/10" />
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                  <div className="sm:col-span-2">
                    <div className="text-sm font-medium">Due Date</div>
                    <div className="text-xs text-foreground/60">We will warn on tight deadlines.</div>
                  </div>
                  <div className="sm:col-span-3 space-y-2">
                    <Input
                      type="datetime-local"
                      value={dueAt}
                      onChange={(e) => setDueAt(e.target.value)}
                    />
                    {deadlineWarning && (
                      <div className="text-xs text-yellow-600">{deadlineWarning}</div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <Divider title="Select Equipment (if applicable)" />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {equipmentCatalog.map((eq) => {
                  const isSelected = selectedEquipment.some((x) => x.id === eq.id);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleEquipment(eq)}
                      disabled={!eq.available}
                      className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                        isSelected ? "border-foreground" : "border-foreground/20"
                      } ${eq.available ? "" : "opacity-50 cursor-not-allowed"}`}
                    >
                      <span>{eq.name}</span>
                      <span className="text-xs text-foreground/60">{eq.available ? (isSelected ? "Selected" : "Available") : "Unavailable"}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <Divider title="Select Songs (if applicable)" />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {songsCatalog.map((s) => {
                  const isSelected = selectedSongs.some((x) => x.id === s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSong(s)}
                      disabled={!s.available}
                      className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                        isSelected ? "border-foreground" : "border-foreground/20"
                      } ${s.available ? "" : "opacity-50 cursor-not-allowed"}`}
                    >
                      <span>
                        {s.title} {s.artist ? <span className="text-foreground/60">• {s.artist}</span> : null}
                      </span>
                      <span className="text-xs text-foreground/60">{s.available ? (isSelected ? "Selected" : "Available") : "Unavailable"}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const next = 3 as const;
                  setStep(next);
                  setMaxStepReached((prev) => (prev < next ? next : prev));
                }}
              >
                Continue to Step 3
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
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
        )}
      </form>

      {/* Success screen */}
      {submitted && (
        <div className="mt-6 rounded-md border border-foreground/15 p-4">
          <div className="text-green-600 text-sm font-medium">Request submitted successfully!</div>
          <div className="text-xs text-foreground/70 mt-1">Your tracking ID: <code>{submitted}</code></div>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button type="button" className="w-full sm:w-auto" onClick={() => router.push("/requests")}>
              View Requests
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={resetForm}
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
