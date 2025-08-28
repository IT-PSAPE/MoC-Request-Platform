import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { RequestItem, RequestStatus } from "@/types/request";

const statusColor: Record<RequestStatus, "gray" | "blue" | "yellow" | "green" | "red"> = {
    not_started: "gray",
    pending: "blue",
    in_progress: "yellow",
    completed: "green",
    dropped: "red",
}

interface RequestCardProps extends React.HTMLAttributes<HTMLDivElement> {
    request: RequestItem;
    setActive: (r: RequestItem) => void;
}

function RequestCard({ ...props}: RequestCardProps) {
    return (
        <Card title={`${props.request.what}`}>
            <div className="space-y-2 text-sm">
                <div>
                    <Badge color={statusColor[props.request.status]}>{props.request.status.replace(/_/g, " ")}</Badge>
                </div>
                <div>
                    <span className="text-foreground/60">Who:</span> {props.request.who}
                </div>
                <div>
                    <span className="text-foreground/60">Where:</span> {props.request.where}
                </div>
                <div>
                    <span className="text-foreground/60">When:</span> {props.request.when}
                </div>
                {props.request.additionalInfo && (
                    <div>
                        <span className="text-foreground/60">Additional:</span> {props.request.additionalInfo}
                    </div>
                )}
                <div>
                    <span className="text-foreground/60">Created:</span> {new Date(props.request.createdAt).toLocaleString()}
                </div>
                <div className="pt-1 flex">
                    <Button type="button" variant="secondary" className="w-full" onClick={() => props.setActive(props.request)}>Details</Button>
                </div>
            </div>
        </Card>
    )
}

export default RequestCard