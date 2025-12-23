'use client';

import Text from "@/components/ui/common/text";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

export default function RequestDetails5WH({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">5Ws and 1H</Text>
      <div className="space-y-3">
        <div>
          <Text as="span" style="label-sm" >Who: </Text>
          <Text as="span" style="paragraph-sm" className="text-tertiary">{request.who || "Not specified"}</Text>
        </div>
        <div>
          <Text as="span" style="label-sm" >What: </Text>
          <Text as="span" style="paragraph-sm" className="text-tertiary">{request.what || "Not specified"}</Text>
        </div>
        <div>
          <Text as="span" style="label-sm" >When: </Text>
          <Text as="span" style="paragraph-sm" className="text-tertiary">{request.when || "Not specified"}</Text>
        </div>
        <div>
          <Text as="span" style="label-sm" >Where: </Text>
          <Text as="span" style="paragraph-sm" className="text-tertiary">{request.where || "Not specified"}</Text>
        </div>
        <div>
          <Text as="span" style="label-sm" >Why: </Text>
          <Text as="span" style="paragraph-sm" className="text-tertiary">{request.why || "Not specified"}</Text>
        </div>
        <div>
          <Text as="span" style="label-sm" >How: </Text>
          <Text as="span" style="paragraph-sm" className="text-tertiary">{request.how || "Not specified"}</Text>
        </div>
        {request.info && (
          <div>
            <Text as="span" style="label-sm" >Additional Information: </Text>
            <Text as="span" style="paragraph-sm" className="text-tertiary">{request.info}</Text>
          </div>
        )}
      </div>
    </section>
  );
}
