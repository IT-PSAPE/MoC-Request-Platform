import { cn } from "@/lib/cn";
import Switch from "../switch";
import Button from "../button";
import Text from "../text";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "../sheet/sheet";

interface VenueCardProps {
  className?: string;
  venueName: string;
  venueId: string;
  available: boolean;
  onToggleActive: (available: boolean) => void;
}

export function VenueCard({
  className,
  venueName,
  venueId,
  available,
  onToggleActive,
}: VenueCardProps) {
  return (
    <div className={cn("border border-secondary rounded-lg shadow-md", className)}>
      <div className="flex items-center justify-between p-4 ">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{venueName}</h3>
          <p className="text-xs text-muted-foreground">ID: {venueId}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {available ? "Available" : "Unavailable"}
          </span>
          <Switch
            checked={available}
            onCheckedChange={onToggleActive}
          />
        </div>
      </div>
      <div className="p-3 border-t border-secondary">
        <Sheet>
          <SheetTrigger>
            <Button type="button" variant="secondary" className="w-full">Open details</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <Text style="title-h6">{venueName}</Text>
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
