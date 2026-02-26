'use client';

import { useState } from "react";
import { Button, Text, TextArea } from "@/components/ui";
import { Dialog } from "@/components/ui/base/dialog";
import { type RequestDetailsBaseProps } from "../request.utils";

interface RequestCommentModalProps extends RequestDetailsBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComment?: (requestId: string, comment: string) => Promise<void>;
}

export default function RequestCommentModal({
  request,
  isOpen,
  onClose,
  onAddComment,
}: RequestCommentModalProps) {
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveComment = async () => {
    if (!comment.trim() || !onAddComment || isSaving) return;

    setIsSaving(true);
    try {
      await onAddComment(request.id, comment.trim());
      setComment("");
      onClose();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    setComment("");
    onClose();
  };

  const handleCancel = () => {
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Dialog.Content>
        <Dialog.Header>
          <Text style="title-h6">Add Comment</Text>
          <Text style="paragraph-sm" className="text-tertiary mt-1">
            Add a comment to this request.
          </Text>
        </Dialog.Header>
        <Dialog.Body>
          <Text style="label-sm" className="text-tertiary mb-2">Comment</Text>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment..."
            className="w-full p-3 border border-secondary rounded-md bg-primary resize-none focus:outline-none focus:ring-2 focus:ring-brand-solid focus:border-transparent"
            rows={4}
            disabled={isSaving}
            autoFocus
          />
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveComment}
            disabled={!comment.trim() || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
