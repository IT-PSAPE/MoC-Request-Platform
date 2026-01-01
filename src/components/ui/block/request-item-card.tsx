import { cn } from "@/shared/cn";
import { Button } from "../common/button";
import { Text } from "../common/text";

interface RequestItemCardProps {
    className?: string;
    item: RequestItem;
    onClick?: (item: RequestItem) => void;
}

export function RequestItemCard({ item, className, onClick }: RequestItemCardProps) {
    return (
        <div className={cn("flex flex-col border border-secondary rounded-lg bg-primary", className)}>
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
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => onClick?.(item)}
                >
                    Open details
                </Button>
            </div>
        </div>
    );
}