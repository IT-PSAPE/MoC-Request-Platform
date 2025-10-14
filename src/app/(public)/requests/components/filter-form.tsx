import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

type Props = {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    setFilterOpen: Dispatch<SetStateAction<boolean>>;
    setSortOpen: Dispatch<SetStateAction<boolean>>;
}

function FilterForm({query, setQuery, setFilterOpen, setSortOpen}: Props) {
    return (
        <form className="w-full max-w-7xl px-4 mx-auto flex items-center gap-3 mb-6">
            {/* <Input
                placeholder="Search by ID, name, details..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mr-auto w-full max-w-sm"
            /> */}
            <div className="flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => setFilterOpen(true)}>Filter</Button>
                <Button type="button" size="sm" variant="secondary" onClick={() => setSortOpen(true)}>Sort</Button>
            </div>
        </form>
    )
}

export default FilterForm;