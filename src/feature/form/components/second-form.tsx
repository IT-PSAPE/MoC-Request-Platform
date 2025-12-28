'use client';

import FormField from "./form-field";
import { TextInput } from "./input";
import { Divider } from "@/components/ui/common/divider";
import { EmptyState } from "@/components/ui/common/empty-state";
import VenueCard from "./venue-card";
import SongCard from "./song-card";
import { useFormContext } from "@/feature/form/components/form-context";
import RequestItemCard from "./item-card";
import { Select, SelectOption } from "@/components/ui";
import { useDefaultContext } from "@/components/contexts/defaults-context";
import { InlineAlert } from "@/components/ui/common/inline-alert";
import { useEffect } from "react";

export function SecondForm() {
    const { songs, venues, items, request, setRequest, noticeAlert, checkNoticePeriod } = useFormContext();
    const { priorities, types } = useDefaultContext();

    function handlePriorityChange(value: string) {
        setRequest((request) => {
            return { ...request, priority: value }
        })
    }

    function handleTypeChange(value: string) {
        setRequest((request) => {
            return { ...request, type: value }
        });
        checkNoticePeriod(types);
    }

    function handleDueChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRequest((request) => {
            return { ...request, due: event.target.value }
        });
        checkNoticePeriod(types);
    }

    // Check notice period when component mounts or when types change
    useEffect(() => {
        checkNoticePeriod(types);
    }, [types, checkNoticePeriod]);

    return (
        <>
            <FormField label="Priority" description="Higher priority may be processed sooner.">
                <Select
                    onValueChange={handlePriorityChange}
                    value={request.priority}
                    displayValue={priorities.find(p => p.id === request.priority)?.name}
                    placeholder="Select priority..."
                >
                    {
                        priorities.map((priority) => (
                            <SelectOption key={priority.id} value={priority.id}>{priority.name}</SelectOption>
                        ))
                    }
                </Select>
            </FormField>
            <Divider />
            <FormField label="Type of Request" description="Select what you are requesting.">
                <Select
                    onValueChange={handleTypeChange}
                    value={request.type}
                    displayValue={types.find(t => t.id === request.type)?.name}
                    placeholder="Select type..."
                >
                    {
                        types.map((type) => (
                            <SelectOption key={type.id} value={type.id}>{type.name}</SelectOption>
                        ))
                    }
                </Select>
            </FormField>
            <Divider />
            <FormField label="Due Date" description="We will warn on tight deadlines.">
                <TextInput type="datetime-local" value={request.due} onChange={handleDueChange} />
            </FormField>
            {noticeAlert && <InlineAlert type="warning" message={noticeAlert} />}
            <Divider />
            <FormField label="Select Venue" description="(optional)" mode="column">
                {
                    venues.length === 0 ? (
                        <EmptyState title="No information" message="No venues available." />
                    ) : (
                        <div className="grid grid-cols-3 gap-2 flex-col max-md:flex">
                            {venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
                        </div>
                    )
                }
            </FormField>
            <Divider />
            <FormField label="Select equipment" description="(optional)" mode="column">
                {
                    items.length === 0 ? (
                        <EmptyState title="No information" message="No Request Item available." />
                    ) : (
                        <div className="grid grid-cols-3 gap-2 flex-col max-md:flex">
                            {items.map((item) => <RequestItemCard key={item.id} item={item} />)}
                        </div>
                    )
                }
            </FormField>
            <Divider />
            <FormField label="Select songs" description="(optional)" mode="column">
                {
                    songs.length === 0 ? (
                        <EmptyState title="No information" message="No song available." />
                    ) : (
                        <div className="grid grid-cols-3 gap-2 flex-col max-md:flex">
                            {songs.map((song) => <SongCard key={song.id} song={song} />)}
                        </div>
                    )
                }
            </FormField>
        </>
    )
}
