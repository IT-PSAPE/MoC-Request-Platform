'use client';

import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

export default function RequestDetailsFlow({ request }: RequestDetailsBaseProps) {
    return (
        <section>
            <Text style="label-md" className="mb-3">Request Flow</Text>
            {request.flow && request.flow.length > 0 ? (
                <div className="space-y-3">
                    {request.flow.map((step, idx) => (
                        <div key={idx} className="p-3 bg-secondary rounded-md">
                            <div className="flex items-start gap-3">
                                <Text style="paragraph-sm">{step || "Not specified"}</Text>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No flow defined"
                    message="There are no flow steps for this request."
                />
            )}
        </section>
    );
}
