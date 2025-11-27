'use client';

import { useState } from "react";
import { Sheet } from "@/components/common/sheet/sheet";
import Divider from "@/components/common/divider";
import { IconButton } from "@/components/common/button";
import Icon from "@/components/common/icon";

// Import all section components
import RequestDetailsOverview from "./components/sections/request-details-overview";
import RequestDetails5WH from "./components/sections/request-details-5wh";
import RequestDetailsVenues from "./components/sections/request-details-venues";
import RequestDetailsEquipment from "./components/sections/request-details-equipment";
import RequestDetailsSongs from "./components/sections/request-details-songs";
import RequestDetailsComments from "./components/sections/request-details-comments";
import RequestDeleteConfirmation from "./components/sections/request-delete-confirmation";
import RequestDetailsFlow from "./components/sections/request-details-flow";

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
}: RequestDetailsSheetProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
              <IconButton 
                onClick={handleOpenConfirm} 
                disabled={!onDeleteRequest} 
                variant="ghost"
              >
                <Icon.trash size={16} />
              </IconButton>
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
                  onAddComment={onAddComment}
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
    </>
  );
}
