import { cn } from "@/lib/cn";
import Switch from "../switch";

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
    <div className={cn("flex items-center justify-between p-4 border border-secondary rounded-lg shadow-md", className)}>
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
  );
}
