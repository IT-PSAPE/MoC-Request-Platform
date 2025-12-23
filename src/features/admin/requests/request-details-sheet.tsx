'use client';

import { useState } from "react";
import { Sheet } from "@/components/base/sheet/sheet";
import Divider from "@/components/common/divider";
import { IconButton } from "@/components/common/controls/button";
import Icon from "@/components/common/icon";

// Import all section components
import RequestDetailsOverview from "./components/sections/request-details-overview";
import RequestDetails5WH from "./components/sections/request-details-5wh";
import RequestDetailsVenues from "./components/sections/request-details-venues";
import RequestDetailsEquipment from "./components/sections/request-details-equipment";
import RequestDetailsSongs from "./components/sections/request-details-songs";
import RequestDetailsFlow from "./components/sections/request-details-flow";
import RequestDetailsComments from "./components/sections/request-details-comments";
import RequestDeleteConfirmation from "./components/sections/request-delete-confirmation";
import RequestCommentModal from "./components/sections/request-comment-modal";

interface RequestDetailsSheetProps {
  request: FetchRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment?: (requestId: string, comment: string) => Promise<void>;
  onDeleteRequest?: (requestId: string) => Promise<void>;
  onUpdateStatus?: (requestId: string, statusId: string) => Promise<void>;
  onUpdatePriority?: (requestId: string, priorityId: string) => Promise<void>;
  onUpdateType?: (requestId: string, typeId: string) => Promise<void>;
  onUpdateDueDate?: (requestId: string, dueDate: string) => Promise<void>;
  onAssignMember?: (requestId: string, memberId: string) => Promise<void>;
  onUnassignMember?: (requestId: string, memberId: string) => Promise<void>;
}

export default function RequestDetailsSheet({
  request,
  isOpen,
  onClose,
  onAddComment,
  onDeleteRequest,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateType,
  onUpdateDueDate,
  onAssignMember,
  onUnassignMember,
}: RequestDetailsSheetProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  if (!request) return null;

  const handleOpenConfirm = () => {
    if (!onDeleteRequest) return;
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
    if (!onAddComment) return;
    setIsCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const handleExpandDetails = () => {
    window.location.href = `/request?id=${request.id}`;
  }

  return (
    <>
      <style jsx>{`
        .scrollable-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Sheet.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }} >
        <Sheet.Content>
          <div className="flex flex-col h-full">
            <Sheet.Header className="justify-end">
              <div className="flex gap-2">
                <IconButton 
                  onClick={handleExpandDetails} 
                  variant="ghost"
                >
                  <Icon.expand />
                </IconButton>
                <IconButton 
                  onClick={handleOpenCommentModal} 
                  disabled={!onAddComment} 
                  variant="ghost"
                >
                  <Icon.pen_line />
                </IconButton>
                <IconButton 
                  onClick={handleOpenConfirm} 
                  disabled={!onDeleteRequest} 
                  variant="ghost"
                >
                  <Icon.trash size={20} />
                </IconButton>
              </div>
            </Sheet.Header>

            {/* Scrollable content with invisible scrollbar */}
            <div
              className="flex-1 px-4 py-2 overflow-y-auto scrollable-content whitespace-pre-wrap"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="space-y-6">
                <RequestDetailsOverview
                  request={request}
                  onUpdateStatus={onUpdateStatus}
                  onUpdatePriority={onUpdatePriority}
                  onUpdateType={onUpdateType}
                  onUpdateDueDate={onUpdateDueDate}
                  onAssignMember={onAssignMember}
                  onUnassignMember={onUnassignMember}
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
              </div>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Root>

      <RequestDeleteConfirmation
        request={request}
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onDeleteRequest={onDeleteRequest ? async (requestId: string) => {
          await onDeleteRequest(requestId);
          handleDeleteComplete();
        } : undefined}
      />

      <RequestCommentModal
        request={request}
        isOpen={isCommentModalOpen}
        onClose={handleCloseCommentModal}
        onAddComment={onAddComment}
      />
    </>
  );
}
