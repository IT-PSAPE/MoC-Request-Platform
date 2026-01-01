"use client";

import MainContent from "@/components/ui/layout/main-content";
import { Icon, IconButton } from "@/components/ui";
import { RequestContextProvider, useRequestContext } from "@/feature/requests/components/request-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import RequestDeleteConfirmation from "@/feature/requests/components/request-delete-confirmation";
import RequestCommentModal from "@/feature/requests/components/request-comment-modal";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <RequestContextProvider>
            <Suspense fallback={<div className="px-margin py-4 h-16" />}>
                <NavigationTop />
            </Suspense>
            {/* <main className="w-full overflow-clip h-full min-h-0"> */}
            <main className="w-full overflow-y-auto h-full min-h-0 mobile:overflow-auto mobile:h-fit">
                <MainContent>
                    {children}
                </MainContent>
            </main>
        </RequestContextProvider>
    );
}

function NavigationTop() {
    const { addCommentToRequest, deleteRequestById, updateRequest, requests } = useRequestContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const requestId = searchParams.get('id')?.replace('/', '');
    const request = requests.find(r => r.id === requestId) || null;

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/board");
        }
    };

    const handleDeleteComplete = () => {
        setIsConfirmOpen(false);
    };

    const handleOpenConfirm = () => {
        if (!deleteRequestById) return;
        setIsConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setIsConfirmOpen(false);
    };

    const handleOpenCommentModal = () => {
        if (!addCommentToRequest) return;
        setIsCommentModalOpen(true);
    };

    const handleCloseCommentModal = () => {
        setIsCommentModalOpen(false);
    };

    const handleArchiveRequest = async () => {
        if (!request || !updateRequest) return;
        await updateRequest(request.id, { archived: !request.archived });
    };

    return (
        <div className="px-margin py-4 sticky top-0 bg-gradient-to-b from-primary to-primary/0 z-10">
            <div className="flex justify-between items-center">
                <div className="bg-primary border border-gray-200 rounded-full">
                    <IconButton variant="ghost" onClick={handleBack}>
                        <Icon.arrow_left size={20} />
                    </IconButton>
                </div>
                <div className="bg-primary border border-gray-200 rounded-full px-1 spacer-x-1">
                    <IconButton variant="ghost" onClick={handleOpenCommentModal} disabled={!addCommentToRequest || request === null}>
                        <Icon.pen_line size={20} />
                    </IconButton>
                    <IconButton variant="ghost" onClick={handleArchiveRequest} disabled={request === null}>
                        {request?.archived ? <Icon.eye size={20} /> : <Icon.eye_off size={20} />}
                    </IconButton>
                    <IconButton variant="ghost" onClick={handleOpenConfirm} disabled={!deleteRequestById || request === null}>
                        <Icon.trash size={20} />
                    </IconButton>
                </div>
            </div>

            {request && (
                <RequestDeleteConfirmation
                    request={request}
                    isOpen={isConfirmOpen}
                    onClose={handleCloseConfirm}
                    onDeleteRequest={deleteRequestById ? async (requestId: string) => {
                        await deleteRequestById(requestId);
                        handleDeleteComplete();
                    } : undefined}
                />
            )}

            {request && (
                <RequestCommentModal
                    request={request}
                    isOpen={isCommentModalOpen}
                    onClose={handleCloseCommentModal}
                    onAddComment={addCommentToRequest}
                />
            )}
        </div>
    );
}