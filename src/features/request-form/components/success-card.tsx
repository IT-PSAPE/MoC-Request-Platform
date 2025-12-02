import Button from "@/components/common/controls/button";
import Link from "next/link";
import { useFormContext } from "@/contexts/form-context";

function SuccessScreen() {

    const { submitted, reset } = useFormContext();

    return (
        <div className="mt-6 rounded-md border border-secondary p-4">
            <div className="text-green-600 text-sm font-medium">Request submitted successfully!</div>
            <div className="text-xs text-tertiary mt-1">Your tracking ID: <code>{submitted}</code></div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <Link href="/board"><Button type="button" className="w-full sm:w-auto">View Requests</Button></Link>
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={reset}
                >
                    Submit Another Request
                </Button>
            </div>
        </div>
    );
}

export default SuccessScreen;