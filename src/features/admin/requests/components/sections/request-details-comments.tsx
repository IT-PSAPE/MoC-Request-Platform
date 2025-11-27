'use client';

import { useState } from "react";
import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import Button from "@/components/common/button";
import { TextArea } from "@/features/request-form/components/input";
import { formatDate, type RequestDetailsCommentsProps } from "../shared/request-details-utils";

export default function RequestDetailsComments({ 
  request, 
  onAddComment 
}: RequestDetailsCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim() || !onAddComment) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(request.id, newComment.trim());
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <section>
      <Text style="label-md" className="mb-3">Comments</Text>

      {/* Existing Comments */}
      {request.note && request.note.length > 0 ? (
        <div className="space-y-3 mb-4">
          {request.note.map((note, index) => (
            <div key={note.id || index}>
              <Text style="paragraph-sm">{note.note}</Text>
              {note.created && (
                <Text style="paragraph-xs" className="text-primary/50 mt-2">
                  {formatDate(note.created)}
                </Text>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4">
          <EmptyState
            title="No comments yet"
            message="Be the first to add a comment to this request."
          />
        </div>
      )}

      {/* Add New Comment */}
      {onAddComment && (
        <div className="space-y-3">
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-secondary rounded-md bg-primary resize-none focus:outline-none focus:ring-2 focus:ring-brand-solid focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmittingComment}
              size="sm"
              className="w-full"
            >
              {isSubmittingComment ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
