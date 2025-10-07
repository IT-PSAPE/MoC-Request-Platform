import { cn } from "@/lib/cn";

interface VenueCardProps {
    className?: string;
    equipmentName: string;
    id: string;
    quantity: number;
    available: number;
    update: (available: number) => void;
}

export function EquipmentCard({ className, equipmentName, id, quantity, available, update }: VenueCardProps) {
    return (
        <div className={cn("flex flex-col p-4 border border-secondary rounded-lg shadow-md", className)}>
            <div className="flex flex-col w-full">
                <div className="flex flex-1 items-center justify-between gap-4 ">
                    <h3 className="font-semibold text-sm">{equipmentName}</h3>
                    <span className="text-xs text-muted-foreground"> Qty: {quantity} </span>
                </div>
                <p className="text-xs text-muted-foreground">ID: {id}</p>
            </div>
            <div className="mt-4 flex gap-1 items-center">
                <span className="text-xs text-muted-foreground" >Available:</span>
                <NumberInput value={available} onChange={update} />
            </div>
        </div>
    );
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
    return (
        <div className="flex border border-secondary rounded-md overflow-hidden text-md">
            <button className="w-5 aspect-1 border-r border-secondary hover:bg-secondary" onClick={() => onChange(value - 1)}>
                -
            </button>
            <input type="text" className="max-w-10 :focus-visible:outline-none! focus:outline-none focus:border-none text-center" value={value} onChange={(e) => onChange(parseInt(e.target.value || '0'))} />
            <button className="w-5 aspect-1 border-l border-secondary hover:bg-secondary" onClick={() => onChange(value + 1)}>
                +
            </button>
        </div>
    );
}
