'use client';

import { useState } from "react";
import Text from "@/components/ui/common/text";
import Button, { IconButton } from "@/components/ui/common/controls/button";
import Icon from "@/components/ui/common/icon";
import { type RequestDetailsDeleteProps } from "../shared/request-details-utils";

export default function RequestDeleteConfirmation({
  request,
  isOpen,
  onClose,
  onDeleteRequest,
}: RequestDetailsDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = async () => {
    if (!request || !onDeleteRequest || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDeleteRequest(request.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete request:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-linear-to-b from-black/20 to-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-[448px] bg-primary rounded-xl border border-secondary shadow-lg">
        <div className="flex items-start justify-between px-5 py-4 border-b border-secondary">
          <div>
            <Text style="title-h6">Delete Request</Text>
            <Text style="paragraph-sm" className="text-tertiary mt-1">
              This action cannot be undone. All associated data with this request will be removed.
            </Text>
          </div>
          <IconButton
            size="sm"
            variant="ghost"
            onClick={handleClose}
            disabled={isDeleting}
          >
            <Icon.close />
          </IconButton>
        </div>
        <div className="px-5 py-6 space-y-2">
          <Text style="label-sm" className="text-tertiary">Request</Text>
          <Text style="title-h6">{request.what || "Untitled Request"}</Text>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-secondary">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteRequest}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
