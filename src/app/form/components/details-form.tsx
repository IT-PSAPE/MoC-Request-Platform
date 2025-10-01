import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useDefaultContext } from "@/components/providers/default-provider";
import EmptyState from "@/components/ui/EmptyState";
import type { RequestFormController } from "@/features/requests/formController";
import { EquipmentTable, SongTable, VenueTable } from "@/lib/database";

type Props = {
    controller: RequestFormController;
};

function DetailsForm({ controller }: Props) {
    const { supabase, types, priorities } = useDefaultContext();

    const {
        type,
        setType,
        due,
        setDue,
        deadlineWarning,
        setStep,
        setMaxStepReached,
        // validateStep2,
        selectedEquipment,
        selectedSongs,
        toggleEquipment,
        setEquipmentQuantity,
        toggleSong,
        priority,
        setPriority,
        // attachments,
        // setAttachments,
        selectedVenues,
        toggleVenue,
    } = controller;

    function handlePriorityChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setPriority(priorities.find((p) => p.id === e.target.value) || null);
    }

    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);

    useEffect(() => {
        EquipmentTable.select(supabase).then((res) => {
            if (res.error) return;
            setEquipment(res.data);
        })
    }, [supabase]);

    useEffect(() => {
        SongTable.select(supabase).then((res) => {
            if (res.error) return;
            setSongs(res.data);
        });
    }, [supabase]);

    useEffect(() => {
        VenueTable.select(supabase).then((res) => {
            if (res.error) return;
            setVenues(res.data);
        });
    }, [supabase]);


    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const v = e.target.value;
        if (v === "") {
            setType(null);
        } else {
            setType(types.find((t) => t.id === v) || null);
        }
    }

    function SongButton(s: Song) {
        const isSelected = selectedSongs.some((x) => x.id === s.id);

        return (
            <button
                key={s.id}
                type="button"
                onClick={() => toggleSong(s)}
                disabled={!s.lyrics && !s.instrumental}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${isSelected ? "border-foreground" : "border-foreground/20"
                    } ${(s.lyrics || s.instrumental) ? "" : "opacity-50 cursor-not-allowed"}`}
            >
                <span className="text-left font-medium line-clamp-1">{s.name}</span>
                <span className="text-xs text-foreground/60">{(s.lyrics || s.instrumental) ? (isSelected ? "Selected" : "Available") : "Unavailable"}</span>
            </button>
        );
    }

    function EquipmentButton(eq: Equipment) {
        const selected = selectedEquipment.find((x) => x.id === eq.id);
        const isSelected = !!selected;
        const left = typeof eq.quantity === "number" ? eq.quantity : 0;
        return (
            <div key={eq.id} className={`rounded-md border p-2 ${isSelected ? "border-foreground" : "border-foreground/20"}`}>
                <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">{eq.name}</div>
                    <div className="text-xs text-foreground/60">Left: {left}</div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => toggleEquipment(eq)}
                        disabled={eq.quantity <= 0}
                        className={`rounded-md px-2 py-1 text-xs ${eq.quantity > 0 ? "bg-foreground/10 hover:bg-foreground/15" : "opacity-50 cursor-not-allowed bg-foreground/5"
                            }`}
                    >
                        {isSelected ? "Remove" : "Add"}
                    </button>
                    {isSelected && (
                        <>
                            <label className="text-xs text-foreground/60">Qty</label>
                            <input
                                type="number"
                                min={1}
                                max={Math.max(1, left)}
                                className="w-20 rounded-md border border-foreground/20 px-2 py-1 text-sm"
                                value={selected.quantity || 1}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value || "1", 10);
                                    const clamped = Math.max(1, Math.min(isFinite(left) ? left : 9999, v));
                                    setEquipmentQuantity(eq.id, clamped);
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        );
    }

    function VenueButton(venue: Venue) {
        const isSelected = selectedVenues.some((x) => x.id === venue.id);

        return (
            <button
                key={venue.id}
                type="button"
                onClick={() => toggleVenue(venue)}
                disabled={!venue.available}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${isSelected ? "border-foreground" : "border-foreground/20"
                    } ${venue.available ? "" : "opacity-50 cursor-not-allowed"}`}
            >
                <span className="text-left font-medium line-clamp-1">{venue.name}</span>
                <span className="text-xs text-foreground/60">{venue.available ? (isSelected ? "Selected" : "Available") : "Unavailable"}</span>
            </button>
        );
    }

    return (
        <>
            <Card>
                <Divider title="Request Type & Due Date" />
                <div className="mt-4 space-y-5">
                    {/* Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">Priority</div>
                            <div className="text-xs text-foreground/60">Higher priority may be processed sooner.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="text-xs text-foreground/60">Priority</label>
                            <Select name="priority" value={priority?.id || ""} onChange={handlePriorityChange}>
                                {priorities.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="border-b border-foreground/10" />
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                        <div className="sm:col-span-2">
                            <div className="text-sm font-medium">Type of Request</div>
                            <div className="text-xs text-foreground/60">Select what you are requesting.</div>
                        </div>
                        <div className="sm:col-span-3">
                            <Select value={type?.id || ""} onChange={handleTypeChange}>
                                <option value="">Select type...</option>
                                {types.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
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
                                value={due}
                                onChange={(e) => setDue(e.target.value)}
                            />
                            {deadlineWarning && (
                                <div className="text-xs text-yellow-600">{deadlineWarning}</div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <Divider title="Select Venue (if applicable)" />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {
                        venues.length === 0 ? (
                            <EmptyState message="No venues available." />
                        ) : (
                            venues.map((eq) => <VenueButton key={eq.id} {...eq} />)
                        )
                    }
                </div>
            </Card>

            <Card>
                <Divider title="Select Equipment (if applicable)" />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {
                        equipment.length === 0 ? (
                            <EmptyState message="No equipment available." />
                        ) : (
                            equipment.map((eq) => <EquipmentButton key={eq.id} {...eq} />)
                        )
                    }
                </div>
            </Card>

            <Card>
                <Divider title="Select Songs (if applicable)" />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {
                        songs.length === 0 ? (
                            <EmptyState message="No songs available." />
                        ) : (
                            songs.map((s) => <SongButton key={s.id} {...s} />)
                        )
                    }
                </div>
            </Card>

            {/* <Card>
                <Divider title="Supporting Files" />
                <div className="mt-4 space-y-5">
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
            </Card> */}

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
    )
}

export default DetailsForm
