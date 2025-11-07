import { cn } from "@/lib/cn";
import Button from "../Button";
import Text from "../text";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "../sheet/sheet";

interface RequestItemCardProps {
    className?: string;
    item: RequestItem;
}

export function RequestItemCard({ item, className }: RequestItemCardProps) {
    return (
        <div className={cn("flex flex-col border border-secondary rounded-lg shadow-md", className)}>
            <div className=" p-4 " >
                <div className="flex flex-col w-full">
                    <div className="flex flex-1 items-center justify-between gap-4 ">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                    </div>
                    <p className="text-xs mb-2 text-tertiary">ID: {item.id}</p>
                    <Text style="paragraph-sm"><span className="text-tertiary">Description:</span> {item.description}</Text>
                </div>
            </div>
            <div className="p-3 border-t border-secondary">
                <Sheet>
                    <SheetTrigger>
                        <Button type="button" variant="secondary" className="w-full">Open details</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <Text style="title-h6">{item.name}</Text>
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