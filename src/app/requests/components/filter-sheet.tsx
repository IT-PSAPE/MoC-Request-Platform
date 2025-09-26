import { Dispatch, SetStateAction } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Sheet from "@/components/ui/Sheet";
import { RequestKind, RequestPriority } from "@/types/request";

type Props = {
    filterOpen: boolean;
    setFilterOpen: Dispatch<SetStateAction<boolean>>;
    priorityFilter:  "all" | RequestPriority;
    setPriorityFilter: Dispatch<SetStateAction<"all" | RequestPriority>>;
    kindFilter: "all" | RequestKind;
    setKindFilter: (value: SetStateAction<"all" | RequestKind>) => void;
    dueStart: string;
    setDueStart: (value: SetStateAction<string>) => void;
    dueEnd: string;
    setDueEnd: (value: SetStateAction<string>) => void;
    resetFilters: () => void;
}

function FilterSheet({filterOpen, setFilterOpen, priorityFilter, setPriorityFilter, kindFilter, setKindFilter, dueStart, setDueStart, dueEnd, setDueEnd, resetFilters}: Props) {
    return (
        <Sheet open={filterOpen} onOpenChange={setFilterOpen} title="Filters" width={420}>
            <div className="space-y-4 text-sm">
                <div>
                    <div className="text-xs text-foreground/60 mb-1">Priority</div>
                    <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}>
                        <option value="all">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </Select>
                </div>
                <div>
                    <div className="text-xs text-foreground/60 mb-1">Type</div>
                    <Select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as typeof kindFilter)}>
                        <option value="all">All</option>
                        <option value="event">Event</option>
                        <option value="video_editing">Video Editing</option>
                        <option value="video_filming_editing">Video Filming + Editing</option>
                        <option value="equipment">Equipment</option>
                        <option value="design_flyer">Design: Flyer</option>
                        <option value="design_special">Design: Special</option>
                    </Select>
                </div>
                <div>
                    <div className="text-xs text-foreground/60 mb-1">Date Range (Due)</div>
                    <div className="flex gap-2">
                        <Input type="datetime-local" value={dueStart} onChange={(e) => setDueStart(e.target.value)} />
                        <Input type="datetime-local" value={dueEnd} onChange={(e) => setDueEnd(e.target.value)} />
                    </div>
                </div>
                <div className="pt-2 flex items-center justify-between gap-2">
                    <Button type="button" size="sm" className="w-full" variant="secondary" onClick={resetFilters}>Reset Filters</Button>
                    <Button type="button" size="sm" className="w-full" onClick={() => setFilterOpen(false)}>Apply Filters</Button>
                </div>
            </div>
        </Sheet>
    )
}

export default FilterSheet;