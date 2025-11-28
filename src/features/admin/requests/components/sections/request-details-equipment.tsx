'use client';

import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";
import Icon from "@/components/common/icon";
import { IconButton } from "@/components/common/button";

export default function RequestDetailsEquipment({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">Selected Equipment</Text>
      {request.item && request.item.length > 0 ? (
        <div className="space-y-1">
          {request.item.map((equipment: RequestedItem, index) => (
            <div key={equipment.item?.id || index} className="p-2 bg-secondary rounded-md">
              <Text style="paragraph-sm">{equipment.item?.name || `Item ${index + 1}`}</Text>
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
