'use client';
import { useEffect, useState } from "react";

import { useDefaultContext } from "@/components/providers/default-provider";
import { EquipmentTable, SongTable, VenueTable } from "@/lib/database";
import FormField from "../form-field";
import { TextInput } from "../input";
import Divider from "../divider";
import EmptyState from "@/components/ui/EmptyState";
import VenueCard from "../ventue-card";
import EquipmentCard from "../equipment-card";
import SongCard from "../song-card";
import { useFormContext } from "../form-provider";
import RequestItemCard from "../item-card";


export default function SecondForm() {
    const { songs, venues, items } = useFormContext();

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
                        <EmptyState message="No Request Item available." />
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {items.map((item) => <RequestItemCard key={item.id} item={item} checked={false} />)}
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