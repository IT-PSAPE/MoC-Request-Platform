'use client';

import { useState } from "react";
import Text from "@/components/ui/common/text";
import Button, { IconButton } from "@/components/ui/common/controls/button";
import Icon from "@/components/ui/common/icon";
import { TextArea } from "@/features/request-form/components/input";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

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
      setComment(""); // Clear the comment after successful save
      onClose();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    setComment(""); // Clear comment when closing without saving
    onClose();
  };

  const handleCancel = () => {
    setComment(""); // Clear comment when cancelling
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
            <Text style="title-h6">Add Comment</Text>
            <Text style="paragraph-sm" className="text-tertiary mt-1">
              Add a comment to this request.
            </Text>
          </div>
          <IconButton
            size="sm"
            variant="ghost"
            onClick={handleClose}
            disabled={isSaving}
          >
            <Icon.close />
          </IconButton>
        </div>
        
        <div className="px-5 py-6">
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
        </div>
        
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-secondary">
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
        </div>
      </div>
    </div>
  );
}
