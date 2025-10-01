import { Dispatch, SetStateAction } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Sheet from "@/components/ui/Sheet";
import { useDefaultContext } from "@/components/providers/default-provider";

type Props = {
    filterOpen: boolean;
    setFilterOpen: Dispatch<SetStateAction<boolean>>;
    priorityFilter: Priority | null;
    setPriorityFilter: Dispatch<SetStateAction<Priority | null>>;
    typeFilter: RequestType | null;
    setTypeFilter: (value: SetStateAction<RequestType | null>) => void;
    dueStart: string;
    setDueStart: (value: SetStateAction<string>) => void;
    dueEnd: string;
    setDueEnd: (value: SetStateAction<string>) => void;
    resetFilters: () => void;
}

function FilterSheet({ filterOpen, setFilterOpen, priorityFilter, setPriorityFilter, typeFilter: kindFilter, setTypeFilter, dueStart, setDueStart, dueEnd, setDueEnd, resetFilters }: Props) {
    const defaults = useDefaultContext();

    function updatePriorityFilter(e: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = e.target;

        if (!value) {
            setPriorityFilter(null);
            return;
        }

        const priority = defaults.priorities.find(p => p.id === value);

        setPriorityFilter(priority || null);
    }

    function updateTypeFilter(e: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = e.target;

        if (!value) {
            setTypeFilter(null);
            return;
        }

        const type = defaults.types.find(t => t.id === value);

        setTypeFilter(type || null);
    }

    return (
        <Sheet open={filterOpen} onOpenChange={setFilterOpen} title="Filters" width={420}>
            <div className="space-y-4 text-sm">
                <div>
                    <div className="text-xs text-foreground/60 mb-1">Priority</div>
                    <Select value={priorityFilter?.id ?? ""} onChange={updatePriorityFilter}>
                        <option value="">All</option>
                        {defaults.priorities.map((priority) => (
                            <option key={priority.id} value={priority.id}>
                                {priority.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <div className="text-xs text-foreground/60 mb-1">Type</div>
                    <Select value={kindFilter?.id ?? ""} onChange={updateTypeFilter}>
                        <option value="">All</option>
                        {defaults.types.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
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
