'use client';

import FormField from "../form-field";
import { TextInput } from "../input";
import Divider from "@/components/common/divider";
import EmptyState from "@/components/common/empty-state";
import VenueCard from "../ventue-card";
import SongCard from "../song-card";
import { useFormContext } from "@/contexts/form-context";
import RequestItemCard from "../item-card";
import Select, { Option } from "@/components/common/forms/select";
import { useDefaultContext } from "@/contexts/defaults-context";
import InlineAlert from "@/components/common/inline-alert";
import { useEffect } from "react";

export default function SecondForm() {
    const { songs, venues, items, request, setRequest, noticeAlert, checkNoticePeriod } = useFormContext();
    const { priorities, types } = useDefaultContext();

    function handlePriorityChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setRequest((request) => {
            return { ...request, priority: event.target.value }
        })
    }

    function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setRequest((request) => {
            return { ...request, type: event.target.value }
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
                <Select onChange={handlePriorityChange} value={request.priority}>
                    <Option value=''>Select priority...</Option>
                    {
                        priorities.map((priority) => (
                            <Option key={priority.id} value={priority.id}>{priority.name}</Option>
                        ))
                    }
                </Select>
            </FormField>
            <Divider />
            <FormField label="Type of Request" description="Select what you are requesting.">
                <Select onChange={handleTypeChange} value={request.type}>
                    <Option value=''>Select type...</Option>
                    {
                        types.map((type) => (
                            <Option key={type.id} value={type.id}>{type.name}</Option>
                        ))
                    }
                </Select>
            </FormField>
            <Divider />
            <FormField label="Due Date" description="We will warn on tight deadlines.">
                <TextInput type="datetime-local" value={request.due} onChange={handleDueChange} />
            </FormField>
            {noticeAlert && <InlineAlert message={noticeAlert} />}
            <Divider />
            <FormField label="Select Venue" description="(optional)" mode="column">
                {
                    venues.length === 0 ? (
                        <EmptyState message="No venues available." />
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
                        <EmptyState message="No Request Item available." />
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
                        <EmptyState message="No song available." />
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