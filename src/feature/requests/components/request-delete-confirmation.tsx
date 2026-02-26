'use client';

import { useState } from "react";
import { Button, Text } from "@/components/ui";
import { Dialog } from "@/components/ui/base/dialog";
import { type RequestDetailsDeleteProps } from "../request.utils";

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
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Dialog.Content>
        <Dialog.Header>
          <Text style="title-h6">Delete Request</Text>
          <Text style="paragraph-sm" className="text-tertiary mt-1">
            This action cannot be undone. All associated data with this request will be removed.
          </Text>
        </Dialog.Header>
        <Dialog.Body className="space-y-2">
          <Text style="label-sm" className="text-tertiary">Request</Text>
          <Text style="title-h6">{request.what || "Untitled Request"}</Text>
        </Dialog.Body>
        <Dialog.Footer>
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
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
