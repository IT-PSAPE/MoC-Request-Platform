import { useAdminContext } from "@/contexts/admin-context";
import { Sheet } from "@/components/base/sheet/sheet";
import Text from "@/components/common/text";
import Divider from "@/components/common/divider";
import Switch from "@/components/common/controls/switch";
import Button from "@/components/common/controls/button";

interface AdminVenueDetailsSheetProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminVenueDetailsSheet({ venue, isOpen, onClose }: AdminVenueDetailsSheetProps) {
  const { updateVenue } = useAdminContext();

  if (!venue) return null;

  const handleToggleAvailable = (isAvailable: boolean) => {
    updateVenue(venue.id, isAvailable);
  };

  return (
    <Sheet.Root open={isOpen} onOpenChange={onClose}>
      <Sheet.Content>
        <Sheet.Header />

        <div className="flex-1 space-y-6 py-6 px-4">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <Text style="title-h6">Basic Information</Text>
            <div className="space-y-2">
              <div>
                <Text style="paragraph-sm" className="text-tertiary">Name</Text>
                <Text style="paragraph-md">{venue.name}</Text>
              </div>
              <div>
                <Text style="paragraph-sm" className="text-tertiary">Venue ID</Text>
                <Text style="paragraph-sm" className="font-mono">{venue.id}</Text>
              </div>
            </div>
          </div>

          <Divider />

          {/* Availability Section */}
          <div className="space-y-4">
            <Text style="title-h6">Availability</Text>
            <div className="flex items-center justify-between">
              <div>
                <Text style="paragraph-md">Available for requests</Text>
                <Text style="paragraph-sm" className="text-tertiary">
                  {venue.available ? "This venue can be used for new requests" : "This venue is currently unavailable"}
                </Text>
              </div>
              <Switch
                checked={venue.available}
                onCheckedChange={handleToggleAvailable}
              />
            </div>
          </div>
        </div>

        <Sheet.Footer>
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  );
}