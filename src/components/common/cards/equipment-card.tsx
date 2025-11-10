import { cn } from "@/lib/cn";
import NumberInput from "../forms/number-input";
import Button from "../button";
import Text from "../text";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "../sheet/sheet";

interface EquipmentCardProps {
    className?: string;
    equipment: Equipment;
    update: (available: number) => void;
}

export function EquipmentCard({ equipment, className, update }: EquipmentCardProps) {
    return (
        <div className={cn("flex flex-col border border-secondary rounded-lg shadow-md", className)}>
            <div className=" p-4 " >
                <div className="flex flex-col w-full">
                    <div className="flex flex-1 items-center justify-between gap-4 ">
                        <h3 className="font-semibold text-sm">{equipment.name}</h3>
                        <span className="text-xs text-muted-foreground"> Qty: {equipment.quantity} </span>
                    </div>
                    <p className="text-xs text-muted-foreground">ID: {equipment.id}</p>
                </div>
                <div className="mt-4 flex gap-1 items-center">
                    <span className="text-xs text-muted-foreground" >Available:</span>
                    <NumberInput value={equipment.available} onChange={update} />
                </div>
            </div>
            <div className="p-3 border-t border-secondary">
                <Sheet>
                    <SheetTrigger>
                        <Button type="button" variant="secondary" className="w-full">Open details</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <Text style="title-h6">{equipment.name}</Text>
                        </SheetHeader>
                        <div className="flex-1">
                        </div>
                        <SheetFooter className="flex justify-end gap-3">
                            <SheetClose className="w-full">
                                <Button className="w-full" variant="secondary">Cancel</Button>
                            </SheetClose>
                            <Button className="w-full">Save Changes</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
