import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useDefualtContext } from "@/components/providers/defualt-provider";

type Props = {
    type: RequestType | null;
    due: string;
    deadlineWarning: string | null;
    setType: Dispatch<SetStateAction<RequestType | null>>;
    setDue: Dispatch<SetStateAction<string>>;
    setStep: (value: SetStateAction<FormSteps>) => void;
    setMaxStepReached: Dispatch<SetStateAction<FormSteps>>;

    selectedEquipment: Equipment[];
    selectedSongs: Song[];
    toggleEquipment: (equipment: Equipment) => void;
    setEquipmentQuantity: (equipmentId: string, quantity: number) => void;
    toggleSong: (song: Song) => void;
}

function DetailsForm({ type, setType, due, setDue, deadlineWarning, setStep, setMaxStepReached, selectedEquipment, selectedSongs, toggleEquipment, setEquipmentQuantity, toggleSong }: Props) {
    const { supabase, types } = useDefualtContext();

    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        const eq = supabase.from("equipment").select("*").order("name");
        eq.then((res) => {
            if (res.error) return;
            setEquipment(res.data);
        });
    }, []);

    useEffect(() => {
        const eq = supabase.from("song").select("*").order("name");
        eq.then((res) => {
            if (res.error) return;
            setSongs(res.data);
        });
    }, []);

    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const v = e.target.value;
        if (v === "") {
            setType(null);
        } else {
            setType(types.find((t) => t.id === v) || null);
        }
    }

    return (
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
                <Divider title="Select Equipment (if applicable)" />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {equipment.map((eq) => {
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
                    })}
                </div>
            </Card>

            <Card>
                <Divider title="Select Songs (if applicable)" />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {songs.map((s) => {
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
                                <span>{s.name}</span>
                                <span className="text-xs text-foreground/60">{(s.lyrics || s.instrumental) ? (isSelected ? "Selected" : "Available") : "Unavailable"}</span>
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
    )
}

export default DetailsForm