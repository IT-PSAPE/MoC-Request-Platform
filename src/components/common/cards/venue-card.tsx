import { cn } from "@/lib/cn";
import Switch from "../switch";
import Button from "../button";
import Text from "../text";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "../sheet/sheet";
import { useAdminContext } from "@/contexts/admin-context";

interface VenueCardProps {
  className?: string;
  venue: Venue;
}

export function VenueCard({className, venue }: VenueCardProps) {
  const { updateVenue } = useAdminContext();

  const onToggleActive = (isActive: boolean) => {
    updateVenue(venue.id, isActive);
  };

  return (
    <div className={cn("border border-secondary rounded-lg shadow-md", className)}>
      <div className="flex items-center justify-between p-4 ">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{venue.name}</h3>
          <p className="text-xs text-muted-foreground">ID: {venue.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {venue.available ? "Available" : "Unavailable"}
          </span>
          <Switch
            checked={venue.available}
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
              <Text style="title-h6">{venue.name}</Text>
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
