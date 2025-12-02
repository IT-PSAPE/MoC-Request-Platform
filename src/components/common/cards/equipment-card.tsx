import { cn } from "@/lib/cn";
import NumberInput from "../controls/number-input";
import Button from "../controls/button";
import { useAdminContext } from "@/contexts/admin-context";

interface EquipmentCardProps {
    className?: string;
    equipment: Equipment;
    onClick?: (equipment: Equipment) => void;
}

export function EquipmentCard({ equipment, className, onClick }: EquipmentCardProps) {
    const { updateEquipment } = useAdminContext();

    function updateQuantity(quantity: number) {
        const clamped = Math.max(0, Math.min(isFinite(equipment.quantity) ? equipment.quantity : 9999, quantity));

        if (clamped === equipment.available || (clamped === equipment.available && clamped !== equipment.quantity)) return

        updateEquipment(equipment.id, clamped);
    }
    
    return (
        <div className={cn("flex flex-col border border-secondary rounded-lg bg-primary", className)}>
            <div className=" p-4 " >
                <div className="flex flex-col w-full">
                    <div className="flex flex-1 items-center justify-between gap-4 ">
                        <h3 className="font-semibold text-sm">{equipment.name}</h3>
                        <span className="text-xs text-tertiary"> Qty: {equipment.quantity} </span>
                    </div>
                    <p className="text-xs text-tertiary">ID: {equipment.id}</p>
                </div>
                <div className="mt-4 flex gap-1 items-center">
                    <span className="text-xs text-tertiary" >Available:</span>
                    <NumberInput value={equipment.available} onChange={updateQuantity} />
                </div>
            </div>
            <div className="p-3 border-t border-secondary">
                <Button 
                    type="button" 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => onClick?.(equipment)}
                >
                    Open details
                </Button>
            </div>
        </div>
    );
}
