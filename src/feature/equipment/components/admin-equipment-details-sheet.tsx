import { Sheet } from "@/components/ui/base/sheet";
import { Divider, Text, TextArea } from "@/components/ui/common";
import { Button, NumberInput } from "@/components/ui";
import { useEquipmentContext } from "./equipment-context";

interface AdminEquipmentDetailsSheetProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminEquipmentDetailsSheet({ equipment, isOpen, onClose }: AdminEquipmentDetailsSheetProps) {
  const { updateEquipment } = useEquipmentContext();

  if (!equipment) return null;

  const handleUpdateAvailable = (newAvailable: number) => {
    const clamped = Math.max(0, Math.min(isFinite(equipment.quantity) ? equipment.quantity : 9999, newAvailable));
    if (clamped === equipment.available || (clamped === equipment.available && clamped !== equipment.quantity)) return;
    updateEquipment(equipment.id, clamped);
  };

  return (
    <Sheet.Provider open={isOpen} onOpenChange={onClose}>
      <Sheet.Content>
        <Sheet.Header />
        <div className="flex-1 px-4 py-2 space-y-6">
          {/* Basic Info Section */}
          <Text style="title-h6">{equipment.name}</Text>

          <Divider />

          <div>
            <TextArea value={equipment.description} />
          </div>

          <Divider />

          {/* Availability Section */}
          <div className="space-y-4">
            <Text style="title-h6">Availability Management</Text>
            <div className="space-y-4">
              <div>
                <Text style="paragraph-md" className="mb-2">Available for requests</Text>
                <Text style="paragraph-sm" className="text-tertiary mb-3">
                  Set how many units of this equipment are currently available for assignment to requests.
                  Maximum available: {equipment.quantity}
                </Text>
                <div className="flex items-center gap-3">
                  <NumberInput
                    value={equipment.available}
                    onChange={handleUpdateAvailable}
                  />
                  <Text style="paragraph-sm" className="text-tertiary">
                    / {equipment.quantity} total
                  </Text>
                </div>
              </div>

              {/* Status indicator */}
              <div className="p-3 rounded-lg bg-utility-gray-50">
                <Text style="paragraph-sm">
                  <span className="font-medium">Status:</span>{" "}
                  {equipment.available === 0 && (
                    <span className="text-utility-red-600">No units available</span>
                  )}
                  {equipment.available > 0 && equipment.available < equipment.quantity && (
                    <span className="text-utility-yellow-600">
                      Partially available ({equipment.available} of {equipment.quantity})
                    </span>
                  )}
                  {equipment.available === equipment.quantity && (
                    <span className="text-utility-green-600">Fully available</span>
                  )}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <Sheet.Footer>
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Provider>
  );
}