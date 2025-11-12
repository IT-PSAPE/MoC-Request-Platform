import { useEffect, useMemo, useState } from "react";
import Text from "@/components/common/text";
import Header from "@/app/admin/components/header";
import { Column, KanbanBoard } from "@/components/common/kanban/kanban";
import { useDefaultContext } from "@/contexts/defaults-context";
import { useAdminContext } from "@/contexts/admin-context";
import RequestDetailsSheet from "@/components/admin/request-details-sheet";

export default function RequestsContent() {
    const { statuses } = useDefaultContext();
    const { requests, updateRequestStatusOptimistic, addCommentToRequest, deleteRequestById } = useAdminContext();
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const selectedRequest = useMemo(() => {
        if (!selectedRequestId) return null;
        return requests.find((request) => request.id === selectedRequestId) ?? null;
    }, [requests, selectedRequestId]);

    const columns: Column[] = statuses.map((status) => ({ [status.id]: status.name }));

    const handleRequestClick = (request: FetchRequest) => {
        setSelectedRequestId(request.id);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedRequestId(null);
    };

    useEffect(() => {
        if (!selectedRequest && isSheetOpen) {
            setIsSheetOpen(false);
            setSelectedRequestId(null);
        }
    }, [selectedRequest, isSheetOpen]);

    return (
        <>
            <Header>
                <Text style="title-h4">Requests</Text>
                <Text style="paragraph-md">Drag and drop requests to update their status</Text>
            </Header>
            <KanbanBoard 
                columns={columns} 
                data={requests} 
                isDraggable={true}
                onRequestStatusChange={updateRequestStatusOptimistic}
                onRequestClick={handleRequestClick}
            />
            
            <RequestDetailsSheet
                request={selectedRequest}
                isOpen={isSheetOpen}
                onClose={handleCloseSheet}
                onAddComment={addCommentToRequest}
                onDeleteRequest={deleteRequestById}
            />
        </>
    );
}
