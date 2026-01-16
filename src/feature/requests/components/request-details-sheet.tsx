'use client';

import { useState } from "react";
import { Sheet } from "@/components/ui/base/sheet/sheet";
import { IconButton } from "@/components/ui/common/button";
import { Divider, Icon } from "@/components/ui/common";

// Import all section components
import RequestDetailsOverview from "./request-details-overview";
import RequestDetails5WH from "./request-details-5wh";
import RequestDetailsVenues from "./request-details-venues";
import RequestDetailsEquipment from "./request-details-equipment";
import RequestDetailsSongs from "./request-details-songs";
import RequestDetailsFlow from "./request-details-flow";
import RequestDetailsComments from "./request-details-comments";
import RequestDeleteConfirmation from "./request-delete-confirmation";
import RequestCommentModal from "./request-comment-modal";
import { ScrollContainer } from "@/components/ui/layout/scroll-container";
import { useRequestContext } from "./request-context";

interface RequestDetailsSheetProps {
  request: FetchRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestDetailsSheet({
  request,
  isOpen,
  onClose,
}: RequestDetailsSheetProps) {
  const { addCommentToRequest, deleteRequestById, updateRequestStatusOptimistic, updateRequestPriorityOptimistic, updateRequestTypeOptimistic, updateRequestDueDateOptimistic, assignMemberToRequest, unassignMemberFromRequest, updateRequest } = useRequestContext();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  if (!request) return null;

  const handleOpenConfirm = () => {
    if (!deleteRequestById) return;
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleDeleteComplete = () => {
    setIsConfirmOpen(false);
    onClose();
  };

  const handleOpenCommentModal = () => {
    if (!addCommentToRequest) return;
    setIsCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const handleExpandDetails = () => {
    window.location.href = `/request?id=${request.id}`;
  }

  const handleArchiveRequest = async () => {
    await updateRequest(request.id, { archived: !request.archived });
  };

  return (
    <>

      <Sheet.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }} >
        <Sheet.Content>
          <div className="flex flex-col h-full">
            <Sheet.Header className="justify-end">
              <div className="flex gap-2">
                <IconButton variant="ghost" onClick={handleExpandDetails}>
                  <Icon.expand size={20} />
                </IconButton>
                <IconButton variant="ghost" onClick={handleOpenCommentModal} disabled={!addCommentToRequest}>
                  <Icon.pen_line size={20} />
                </IconButton>
                <IconButton variant="ghost" onClick={handleArchiveRequest}>
                  {request.archived ? <Icon.eye size={20} /> : <Icon.eye_off size={20} />}
                </IconButton>
                <IconButton variant="ghost" onClick={handleOpenConfirm} disabled={!deleteRequestById}>
                  <Icon.trash size={20} />
                </IconButton>
              </div>
            </Sheet.Header>

            {/* Scrollable content with invisible scrollbar */}
            <ScrollContainer className="flex-1 px-4 py-2 space-y-6">
              <RequestDetailsOverview
                request={request}
                onUpdateStatus={updateRequestStatusOptimistic}
                onUpdatePriority={updateRequestPriorityOptimistic}
                onUpdateType={updateRequestTypeOptimistic}
                onUpdateDueDate={updateRequestDueDateOptimistic}
                onAssignMember={assignMemberToRequest}
                onUnassignMember={unassignMemberFromRequest}
              />

              <Divider />

              <RequestDetails5WH request={request} />

              <Divider />

              <RequestDetailsVenues request={request} />

              <Divider />

              <RequestDetailsEquipment request={request} />

              <Divider />

              <RequestDetailsSongs request={request} />

              <Divider />

              <RequestDetailsFlow request={request} />

              <Divider />

              <RequestDetailsComments
                request={request}
              />
            </ScrollContainer>
          </div>
        </Sheet.Content>
      </Sheet.Root>

      <RequestDeleteConfirmation
        request={request}
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onDeleteRequest={deleteRequestById ? async (requestId: string) => {
          await deleteRequestById(requestId);
          handleDeleteComplete();
        } : undefined}
      />

      <RequestCommentModal
        request={request}
        isOpen={isCommentModalOpen}
        onClose={handleCloseCommentModal}
        onAddComment={addCommentToRequest}
      />
    </>
  );
}
