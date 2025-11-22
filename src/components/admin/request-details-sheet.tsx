'use client';

import { useState, useEffect } from "react";
import { Sheet } from "@/components/common/sheet/sheet";
import Text from "@/components/common/text";
import Divider from "@/components/common/divider";
import EmptyState from "@/components/common/empty-state";
import Button, { IconButton } from "@/components/common/button";
import Icon from "@/components/common/icon";
import { TextArea } from "@/app/(public)/form/components/input";
import Badge from "../common/badge";
import Select, { Option } from "@/components/common/forms/select";
import { useDefaultContext } from "@/contexts/defaults-context";

interface RequestDetailsSheetProps {
  request: FetchRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment?: (requestId: string, comment: string) => Promise<void>;
  onDeleteRequest?: (requestId: string) => Promise<void>;
  onUpdateStatus?: (requestId: string, statusId: string) => Promise<void>;
}

export default function RequestDetailsSheet({
  request,
  isOpen,
  onClose,
  onAddComment,
  onDeleteRequest,
  onUpdateStatus,
}: RequestDetailsSheetProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { statuses } = useDefaultContext();
  const [selectedStatus, setSelectedStatus] = useState(request?.status?.id || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (request) {
      setSelectedStatus(request.status?.id || "");
    }
  }, [request]);

  if (!request) return null;

  const handleStatusChange = async (newStatusId: string) => {
    if (!onUpdateStatus || !request) return;

    setIsUpdatingStatus(true);
    setSelectedStatus(newStatusId);
    try {
      await onUpdateStatus(request.id, newStatusId);
    } catch (error) {
      console.error("Failed to update status:", error);
      setSelectedStatus(request.status.id); // Revert on error
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatPriority = (priority: Priority) => {
    return priority?.name?.replace(/_/g, " ") || "Not specified";
  };

  const formatRequestType = (type: RequestType) => {
    return type?.name?.replace(/_/g, " ") || "Not specified";
  };

  const handleDeleteRequest = async () => {
    if (!request || !onDeleteRequest || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDeleteRequest(request.id);
      setIsConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete request:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenConfirm = () => {
    if (!onDeleteRequest) return;
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    if (isDeleting) return;
    setIsConfirmOpen(false);
  };

  return (
    <>
      <style jsx>{`
        .scrollable-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Sheet.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <Sheet.Content>
          <div className="flex flex-col h-full">
            <Sheet.Header><span></span></Sheet.Header>

            {/* Scrollable content with invisible scrollbar */}
            <div
              className="flex-1 px-4 py-2 overflow-y-auto scrollable-content whitespace-pre-wrap"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="space-y-6">
                {/* Overview Section */}
                <section className="space-y-5">
                  <Text style="title-h6">{request.what || "Untitled Request"}</Text>
                  <div className="space-y-4">
                    <div className="w-full gap-sm grid grid-cols-2">
                      <Text style="label-sm" className="text-secondary">Created time</Text>
                      <Text style="paragraph-sm">{formatDate(request.created_at)}</Text>
                    </div>
                    <div className="w-full gap-sm grid grid-cols-2 items-center">
                      <Text style="label-sm" className="text-secondary">Status</Text>
                      {onUpdateStatus && statuses.length > 0 ? (
                        <Select
                          value={selectedStatus}
                          onValueChange={handleStatusChange}
                          disabled={isUpdatingStatus}
                          className="py-1"
                        >
                          {statuses.map((status) => (
                            <Option key={status.id} value={status.id}>
                              {status.name}
                            </Option>
                          ))}
                        </Select>
                      ) : (
                        <Badge className="w-fit">{request.status.name}</Badge>
                      )}
                    </div>
                    <div className="w-full gap-sm grid grid-cols-2">
                      <Text style="label-sm" className="text-secondary">Priority</Text>
                      <Badge className="w-fit">{formatPriority(request.priority)}</Badge>
                    </div>
                    <div className="w-full gap-sm grid grid-cols-2">
                      <Text style="label-sm" className="text-secondary">Type</Text>
                      <Badge className="w-fit">{formatRequestType(request.type)}</Badge>
                    </div>
                    <div className="w-full gap-sm grid grid-cols-2">
                      <Text style="label-sm" className="text-tertiary mb-1">Due Date</Text>
                      <Text style="paragraph-sm">{formatDate(request.due)}</Text>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 5Ws and 1H Section */}
                <section>
                  <Text style="label-md" className="mb-3">5Ws and 1H</Text>
                  <div className="space-y-3">
                    <div>
                      <Text style="label-sm" className="text-tertiary mb-1">Who</Text>
                      <Text style="paragraph-sm">{request.who || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-tertiary mb-1">What</Text>
                      <Text style="paragraph-sm">{request.what || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-tertiary mb-1">When</Text>
                      <Text style="paragraph-sm">{request.when || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-tertiary mb-1">Where</Text>
                      <Text style="paragraph-sm">{request.where || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-tertiary mb-1">Why</Text>
                      <Text style="paragraph-sm">{request.why || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-tertiary mb-1">How</Text>
                      <Text style="paragraph-sm">{request.how || "Not specified"}</Text>
                    </div>
                    {request.info && (
                      <div>
                        <Text style="label-sm" className="text-tertiary mb-1">Additional Information</Text>
                        <Text style="paragraph-sm">{request.info}</Text>
                      </div>
                    )}
                  </div>
                </section>

                <Divider />

                {/* Available Venues Section */}
                <section>
                  <Text style="label-md" className="mb-3">Available Venues</Text>
                  {request.venue && request.venue.length > 0 ? (
                    <div className="space-y-2">
                      {request.venue.map((venue: RequestedVenue, index) => (
                        <div key={venue.venue?.id || index} className="p-3 bg-secondary rounded-md">
                          <Text style="paragraph-sm">{venue.venue?.name || `Venue ${index + 1}`}</Text>
                          {venue.venue?.description && (
                            <Text style="paragraph-xs" className="text-tertiary mt-1">
                              {venue.venue.description}
                            </Text>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No venues available"
                      message="No venues have been selected for this request."
                    />
                  )}
                </section>

                <Divider />

                {/* Equipment Section */}
                <section>
                  <Text style="label-md" className="mb-3">Selected Equipment</Text>
                  {request.item && request.item.length > 0 ? (
                    <div className="space-y-2">
                      {request.item.map((equipment: RequestedItem, index) => (
                        <div key={equipment.item?.id || index}>
                          <Text style="paragraph-sm">{equipment.item?.name || `Item ${index + 1}`}</Text>
                          {equipment.item?.description && (
                            <Text style="paragraph-xs" className="text-tertiary mt-1">
                              {equipment.item.description}
                            </Text>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No equipment selected"
                      message="No equipment has been selected for this request."
                    />
                  )}
                </section>

                <Divider />

                {/* Songs Section */}
                <section>
                  <Text style="label-md" className="mb-3">Songs</Text>
                  {request.song && request.song.length > 0 ? (
                    <div className="space-y-2">
                      {request.song.map((song: RequestedSong, index) => (
                        <div key={song.song?.id || index} className="p-3 bg-secondary rounded-md">
                          <Text style="paragraph-sm">{song.song?.name || `Song ${index + 1}`}</Text>
                          <div className="flex gap-2 mt-2">
                            {song.song?.instrumental && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                                Instrumental
                              </span>
                            )}
                            {song.song?.lyrics && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs">
                                Lyrics
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No songs selected"
                      message="No songs have been selected for this request."
                    />
                  )}
                </section>

                <Divider />

                {/* Comments Section */}
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
              </div>
            </div>
            <Sheet.Footer>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleOpenConfirm}
                disabled={!onDeleteRequest}
              >
                Delete Request
              </Button>
            </Sheet.Footer>
          </div>
        </Sheet.Content>
      </Sheet.Root>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-linear-to-b from-black/20 to-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseConfirm();
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
                onClick={handleCloseConfirm}
                disabled={isDeleting}
              >
                <Icon name="line:close" />
              </IconButton>
            </div>
            <div className="px-5 py-6 space-y-2">
              <Text style="label-sm" className="text-tertiary">Request</Text>
              <Text style="title-h6">{request?.what || "Untitled Request"}</Text>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-secondary">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCloseConfirm}
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
      )}
    </>
  );
}
