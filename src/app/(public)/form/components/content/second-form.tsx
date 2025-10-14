import { useDefaultContext } from "@/components/providers/default-provider";
import { EquipmentTable, SongTable, VenueTable } from "@/lib/database";
import { useEffect, useState } from "react";
import FormField from "../form-field";
import { TextInput } from "../input";
import Divider from "../divider";
import EmptyState from "@/components/ui/EmptyState";
import VenueCard from "../ventue-card";
import EquipmentCard from "../equipment-card";
import SongCard from "../song-card";


export default function SecondForm() {
    const { supabase } = useDefaultContext();

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

    return (
        <>
            <FormField label="Priority" description="Higher priority may be processed sooner.">
                <TextInput />
            </FormField>
            <Divider />
            <FormField label="Type of Request" description="Select what you are requesting.">
                <TextInput />
            </FormField>
            <Divider />
            <FormField label="Due Date" description="We will warn on tight deadlines.">
                <TextInput />
            </FormField>
            <Divider />
            <FormField label="Select Venue" description="(optional)" mode="column">
                {
                    venues.length === 0 ? (
                        <EmptyState message="No venues available." />
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {venues.map((venue) => <VenueCard key={venue.id} venue={venue} checked={false} />)}
                        </div>
                    )
                }
            </FormField>
            <Divider />
            <FormField label="Select equipment" description="(optional)" mode="column">
                {
                    venues.length === 0 ? (
                        <EmptyState message="No Equipment available." />
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {equipment.map((equipment) => <EquipmentCard key={equipment.id} equipment={equipment} checked={false} />)}
                        </div>
                    )
                }
            </FormField>
            <Divider />
            <FormField label="Select songs" description="(optional)" mode="column">
                {
                    venues.length === 0 ? (
                        <EmptyState message="No song available." />
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {songs.map((song) => <SongCard key={song.id} song={song} checked={false} />)}
                        </div>
                    )
                }
            </FormField>
        </>
    )
}