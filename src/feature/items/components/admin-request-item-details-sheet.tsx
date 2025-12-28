import { Sheet } from "@/components/ui/base/sheet";
import { Divider, Text } from "@/components/ui/common";
import Button from "@/components/ui/common/button";

interface AdminRequestItemDetailsSheetProps {
  item: RequestItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminRequestItemDetailsSheet({ item, isOpen, onClose }: AdminRequestItemDetailsSheetProps) {
  if (!item) return null;

  return (
    <Sheet.Provider open={isOpen} onOpenChange={onClose}>
      <Sheet.Content>
        <Sheet.Header />

        <div className="flex-1 space-y-6 py-6 px-4">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <Text style="title-h6">Basic Information</Text>
            <div className="space-y-3">
              <div>
                <Text style="paragraph-sm" className="text-tertiary">Item Name</Text>
                <Text style="paragraph-md">{item.name}</Text>
              </div>
              <div>
                <Text style="paragraph-sm" className="text-tertiary">Item ID</Text>
                <Text style="paragraph-sm" className="font-mono">{item.id}</Text>
              </div>
              <div>
                <Text style="paragraph-sm" className="text-tertiary">Description</Text>
                <Text style="paragraph-md">{item.description}</Text>
              </div>
            </div>
          </div>

          <Divider />

          {/* Usage Information */}
          <div className="space-y-4">
            <Text style="title-h6">Usage Information</Text>
            <div className="p-3 rounded-lg bg-utility-blue-50">
              <Text style="paragraph-sm">
                <span className="font-medium text-utility-blue-800">Purpose:</span>{" "}
                <span className="text-utility-blue-700">
                  This is a predefined item that can be attached to requests during submission.
                  Teams can select this item when creating or updating their requests to indicate
                  their specific needs.
                </span>
              </Text>
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