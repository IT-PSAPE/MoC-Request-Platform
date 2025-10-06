import Button from "@/components/ui/Button";
import { RequestFormController } from "@/features/requests/formController";
import Link from "next/link";

type Props = {
    controller: RequestFormController;
};

function SuccessScreen({ controller }: Props) {

    const { submitted, resetForm } = controller;

    return (
        <div className="mt-6 rounded-md border border-foreground/15 p-4">
            <div className="text-green-600 text-sm font-medium">Request submitted successfully!</div>
            <div className="text-xs text-foreground/70 mt-1">Your tracking ID: <code>{submitted}</code></div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <Link href="/requests"><Button type="button" className="w-full sm:w-auto">View Requests</Button></Link>
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