import { cn } from "@/shared/cn";
import { Switch } from "../../components/ui/common/switch";
import { Button } from "../../components/ui/common/button";
import { useVenuesContext } from "@/feature/venues/components/venue-context";

interface VenueCardProps {
  className?: string;
  venue: Venue;
  onClick?: (venue: Venue) => void;
}

export function VenueCard({ className, venue, onClick }: VenueCardProps) {
  const { updateVenue } = useVenuesContext();

  const onToggleActive = (isActive: boolean) => {
    updateVenue(venue.id, isActive);
  };

  return (
    <div className={cn("border border-secondary rounded-lg bg-primary", className)}>
      <div className="flex items-center justify-between p-4 ">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{venue.name}</h3>
          <p className="text-xs text-tertiary">ID: {venue.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-tertiary">
            {venue.available ? "Available" : "Unavailable"}
          </span>
          <Switch
            checked={venue.available}
            onCheckedChange={onToggleActive}
          />
        </div>
      </div>
      <div className="p-3 border-t border-secondary">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => onClick?.(venue)}
        >
          Open details
        </Button>
      </div>
    </div>
  );
}
