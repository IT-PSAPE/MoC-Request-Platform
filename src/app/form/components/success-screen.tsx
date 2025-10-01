import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import { useRequestFormController } from "@/features/requests/formController";

function SuccessScreen() {

    const { submitted, resetForm } = useRequestFormController();

    const router = useRouter();

    return (
        <div className="mt-6 rounded-md border border-foreground/15 p-4">
            <div className="text-green-600 text-sm font-medium">Request submitted successfully!</div>
            <div className="text-xs text-foreground/70 mt-1">Your tracking ID: <code>{submitted}</code></div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <Button type="button" className="w-full sm:w-auto" onClick={() => router.push("/requests")}>
                    View Requests
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={resetForm}
                >
                    Submit Another Request
                </Button>
            </div>
        </div>
    );
}

export default SuccessScreen;