'use client';

import Text from "@/components/common/text";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

export default function RequestDetails5WH({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">5Ws and 1H</Text>
      <div className="space-y-3">
        <div>
          <Text style="label-sm" className="text-tertiary mb-1">Who</Text>
          <Text style="paragraph-sm">{request.who || "Not specified"}</Text>
        </div>
        <div>
          <Text style="label-sm" className="text-tertiary mb-1">What</Text>
          <Text style="paragraph-sm">{request.what || "Not specified"}</Text>
        </div>
        <div>
          <Text style="label-sm" className="text-tertiary mb-1">When</Text>
          <Text style="paragraph-sm">{request.when || "Not specified"}</Text>
        </div>
        <div>
          <Text style="label-sm" className="text-tertiary mb-1">Where</Text>
          <Text style="paragraph-sm">{request.where || "Not specified"}</Text>
        </div>
        <div>
          <Text style="label-sm" className="text-tertiary mb-1">Why</Text>
          <Text style="paragraph-sm">{request.why || "Not specified"}</Text>
        </div>
        <div>
          <Text style="label-sm" className="text-tertiary mb-1">How</Text>
          <Text style="paragraph-sm">{request.how || "Not specified"}</Text>
        </div>
        {request.info && (
          <div>
            <Text style="label-sm" className="text-tertiary mb-1">Additional Information</Text>
            <Text style="paragraph-sm">{request.info}</Text>
          </div>
        )}
      </div>
    </section>
  );
}
