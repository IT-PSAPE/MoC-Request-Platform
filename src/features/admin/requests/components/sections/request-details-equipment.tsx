'use client';

import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

export default function RequestDetailsEquipment({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">Selected Equipment</Text>
      {request.item && request.item.length > 0 ? (
        <div className="space-y-2">
          {request.item.map((equipment: RequestedItem, index) => (
            <div key={equipment.item?.id || index}>
              <Text style="paragraph-sm">{equipment.item?.name || `Item ${index + 1}`}</Text>
              {equipment.item?.description && (
                <Text style="paragraph-xs" className="text-tertiary mt-1">
                  {equipment.item.description}
                </Text>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No equipment selected"
          message="No equipment has been selected for this request."
        />
      )}
    </section>
  );
}
