'use client';


import { EmptyState, Text } from "@/components/ui/common";
import { type RequestDetailsBaseProps } from "../request.utils";

export default function RequestDetailsFlow({
    request
}: RequestDetailsBaseProps) {

    return (
        <section>
            <Text style="label-md" className="mb-3">Event Flow</Text>

            {/* Flow Steps */}
            {request.flow && request.flow.length > 0 ? (
                <div className="space-y-1">
                    {request.flow.map((step, index) => (
                        <div key={index} className="p-2 bg-secondary rounded-md">
                            <Text style="paragraph-xs" className="text-tertiary">Step {index + 1}</Text>
                            <Text style="paragraph-sm" className="whitespace-pre-wrap">{step}</Text>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No flow steps defined"
                    message="No event flow has been specified for this request."
                />
            )}
        </section>
    );
}
