"use client";

import { useEffect, useMemo, useState } from "react";
import Text from "@/components/common/text";
import Header from "@/components/common/header";
import { RequestList } from "@/components/common/request-list/request-list";
import { useAdminContext } from "@/contexts/admin-context";
import RequestDetailsSheet from "@/components/admin/request-details-sheet";

export default function RequestsContent() {
    const { requests, addCommentToRequest, deleteRequestById, updateRequestStatusOptimistic } = useAdminContext();
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const selectedRequest = useMemo(() => {
        if (!selectedRequestId) return null;
        return requests.find((request) => request.id === selectedRequestId) ?? null;
    }, [requests, selectedRequestId]);

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
                <Text style="paragraph-md">View and manage all requests in one place</Text>
            </Header>
            <RequestList 
                requests={requests} 
                onRequestClick={handleRequestClick}
                isPublic={false}
                onRequestStatusChange={updateRequestStatusOptimistic}
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
