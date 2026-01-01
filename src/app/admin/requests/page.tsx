"use client";

import { useEffect, useMemo, useState } from "react";
import { Text } from "@/components/ui/common/text";
import { Header } from "@/components/ui/layout/header";
import RequestDetailsSheet from "@/feature/requests/components/details-sheet/request-details-sheet";
import { useRequestContext } from "@/feature/requests/components/request-context";
import { AdminRequestList } from "@/feature/requests/components/admin-request-list";

export default function RequestsContent() {
    const { requests } = useRequestContext();

    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const selectedRequest = useMemo(() => {
        if (!selectedRequestId) return null;
        return requests.find((request) => request.id === selectedRequestId) ?? null;
    }, [requests, selectedRequestId]);

    useEffect(() => {
        if (!selectedRequest && isSheetOpen) {
            setIsSheetOpen(false);
            setSelectedRequestId(null);
        }
    }, [selectedRequest, isSheetOpen]);

    const handleRequestClick = (request: FetchRequest) => {
        setSelectedRequestId(request.id);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedRequestId(null);
    };

    return (
        <>
            <Header>
                <Text style="title-h4">Requests</Text>
                <Text style="paragraph-md">View and manage all requests in one place</Text>
            </Header>

            <AdminRequestList
                requests={requests}
                onRequestClick={handleRequestClick}
            />

            <RequestDetailsSheet
                request={selectedRequest}
                isOpen={isSheetOpen}
                onClose={handleCloseSheet}
            />
        </>
    );
}
