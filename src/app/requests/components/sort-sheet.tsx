import { Dispatch, SetStateAction } from "react";

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Sheet from "@/components/ui/Sheet";
import Switch from "@/components/ui/Switch";
import { SortRule } from "@/features/requests/useRequestsListController";

type Props = {
    sortOpen: boolean;
    setSortOpen: Dispatch<SetStateAction<boolean>>;
    sortRules: SortRule[];
    setSortRules: Dispatch<SetStateAction<SortRule[]>>;
    resetSorts: () => void;
}

function SortSheet({sortOpen, setSortOpen, sortRules, setSortRules, resetSorts}: Props) {
    return (
        <Sheet open={sortOpen} onOpenChange={setSortOpen} title="Sort" width={420}>
            <div className="space-y-4 text-sm">
                {sortRules.map((rule, idx) => (
                    <div key={rule.key} className="flex items-center justify-between gap-2">
                        <div className="font-medium capitalize">{rule.key === "createdAt" ? "Created" : rule.key === "dueAt" ? "Due" : "Priority"}</div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={rule.enabled}
                                onCheckedChange={(v) => setSortRules((rs) => rs.map((r, i) => i === idx ? { ...r, enabled: v } : r))}
                                aria-label={`Toggle ${rule.key} sort`}
                            />
                            <Select value={rule.dir} onChange={(e) => setSortRules((rs) => rs.map((r, i) => i === idx ? { ...r, dir: e.target.value as "asc" | "desc" } : r))}>
                                <option value="asc">Asc</option>
                                <option value="desc">Desc</option>
                            </Select>
                        </div>
                    </div>
                ))}
                <div className="pt-2 flex items-center justify-between gap-2">
                    <Button type="button" size="sm" className="w-full" variant="secondary" onClick={resetSorts}>Reset Sort</Button>
                    <Button type="button" size="sm" className="w-full" onClick={() => setSortOpen(false)}>Apply Sort</Button>
                </div>
            </div>
        </Sheet>
    )
}

export default SortSheet;