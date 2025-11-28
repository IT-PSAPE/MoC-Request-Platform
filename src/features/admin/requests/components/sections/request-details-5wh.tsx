'use client';

import Text from "@/components/common/text";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

export default function RequestDetails5WH({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">5Ws and 1H</Text>
      <div className="space-y-3">
        <div className="*:inline-block">
          <Text style="paragraph-sm" className="text-disable">Who: </Text>
          <Text style="label-sm">{request.who || "Not specified"}</Text>
        </div>
        <div className="*:inline-block">
          <Text style="paragraph-sm" className="text-disable">What: </Text>
          <Text style="label-sm">{request.what || "Not specified"}</Text>
        </div>
        <div className="*:inline-block">
          <Text style="paragraph-sm" className="text-disable">When: </Text>
          <Text style="label-sm">{request.when || "Not specified"}</Text>
        </div>
        <div className="*:inline-block">
          <Text style="paragraph-sm" className="text-disable">Where: </Text>
          <Text style="label-sm">{request.where || "Not specified"}</Text>
        </div>
        <div className="*:inline-block">
          <Text style="paragraph-sm" className="text-disable">Why: </Text>
          <Text style="label-sm">{request.why || "Not specified"}</Text>
        </div>
        <div className="*:inline-block">
          <Text style="paragraph-sm" className="text-disable">How: </Text>
          <Text style="label-sm">{request.how || "Not specified"}</Text>
        </div>
        {request.info && (
          <div className="*:inline-block">
            <Text style="paragraph-sm" className="text-disable">Additional Information: </Text>
            <Text style="label-sm">{request.info}</Text>
          </div>
        )}
      </div>
    </section>
  );
}
