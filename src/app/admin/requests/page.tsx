"use client";

import { useEffect, useMemo, useState } from "react";
import { Text } from "@/components/ui/common/text";
import { Header } from "@/components/ui/layout/header";
import { useAdminContext } from "@/components/contexts/admin-context";
import RequestDetailsSheet from "@/feature/requests/components/details-sheet/request-details-sheet";
import { RequestList } from "@/components/ui/block/request-list";

export default function RequestsContent() {
    const { requests } = useAdminContext();

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
            />

            <RequestDetailsSheet
                request={selectedRequest}
                isOpen={isSheetOpen}
                onClose={handleCloseSheet}
            />
        </>
    );
}
