'use client';

import Loader from "@/components/common/loader";
import Text from "@/components/common/text";

export default function FormProcessing() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 w-full max-w-[1152px] mx-auto">
            <Loader className="mb-6" />
            <div className="text-center space-y-3 max-w-md">
                <Text style="label-md" className="font-medium text-primary">
                    We are submitting your request...
                </Text>
                <Text style="paragraph-sm" className="text-tertiary max-w-sm">
                    Please wait while we process your submission. This may take a few moments.
                </Text>
            </div>
        </div>
    );
}
