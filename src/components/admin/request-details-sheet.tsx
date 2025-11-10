'use client';

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/common/sheet/sheet";
import Text from "@/components/common/text";
import Divider from "@/components/common/divider";
import EmptyState from "@/components/common/empty-state";
import Button from "@/components/common/button";
import { TextArea } from "@/app/(public)/form/components/input";

interface RequestDetailsSheetProps {
  request: FetchRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment?: (requestId: string, comment: string) => Promise<void>;
}

export default function RequestDetailsSheet({
  request,
  isOpen,
  onClose,
  onAddComment
}: RequestDetailsSheetProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!request) return null;

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

  return (
    <>
      <style jsx>{`
        .scrollable-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <SheetContent>
          <div className="flex flex-col h-full">
            <SheetHeader>
              <Text style="title-h5">Request Details</Text>
            </SheetHeader>

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
                <section>
                  <Text style="label-md" className="mb-3">Overview</Text>
                  <div className="space-y-3">
                    <div>
                      <Text style="label-sm" className="text-foreground/70 mb-1">Request Name</Text>
                      <Text style="paragraph-md">{request.what || "Untitled Request"}</Text>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Text style="label-sm" className="text-foreground/70 mb-1">Priority</Text>
                        <Text style="paragraph-sm">{formatPriority(request.priority)}</Text>
                      </div>
                      <div>
                        <Text style="label-sm" className="text-foreground/70 mb-1">Type</Text>
                        <Text style="paragraph-sm">{formatRequestType(request.type)}</Text>
                      </div>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-foreground/70 mb-1">Due Date</Text>
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
                      <Text style="label-sm" className="text-foreground/70 mb-1">Who</Text>
                      <Text style="paragraph-sm">{request.who || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-foreground/70 mb-1">What</Text>
                      <Text style="paragraph-sm">{request.what || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-foreground/70 mb-1">When</Text>
                      <Text style="paragraph-sm">{request.when || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-foreground/70 mb-1">Where</Text>
                      <Text style="paragraph-sm">{request.where || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-foreground/70 mb-1">Why</Text>
                      <Text style="paragraph-sm">{request.why || "Not specified"}</Text>
                    </div>
                    <div>
                      <Text style="label-sm" className="text-foreground/70 mb-1">How</Text>
                      <Text style="paragraph-sm">{request.how || "Not specified"}</Text>
                    </div>
                    {request.info && (
                      <div>
                        <Text style="label-sm" className="text-foreground/70 mb-1">Additional Information</Text>
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
                      {request.venue.map((venueItem: any, index) => (
                        <div key={venueItem.venue?.id || index} className="p-3 bg-secondary/50 rounded-md">
                          <Text style="paragraph-sm">{venueItem.venue?.name || `Venue ${index + 1}`}</Text>
                          {venueItem.venue?.description && (
                            <Text style="paragraph-xs" className="text-foreground/70 mt-1">
                              {venueItem.venue.description}
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
                      {request.item.map((equipmentItem: any, index) => (
                        <div key={equipmentItem.item?.id || index}>
                          <Text style="paragraph-sm">{equipmentItem.item?.name || `Item ${index + 1}`}</Text>
                          {equipmentItem.item?.description && (
                            <Text style="paragraph-xs" className="text-foreground/70 mt-1">
                              {equipmentItem.item.description}
                            </Text>
                          )}
                        </div>
                        // <div key={equipmentItem.item?.id || index} className="p-3 bg-secondary/50 rounded-md">
                        //   <div className="flex justify-between items-start">
                        //     <div>
                        //       <Text style="paragraph-sm">{equipmentItem.item?.name || `Item ${index + 1}`}</Text>
                        //       {equipmentItem.item?.description && (
                        //         <Text style="paragraph-xs" className="text-foreground/70 mt-1">
                        //           {equipmentItem.item.description}
                        //         </Text>
                        //       )}
                        //     </div>
                        //     {equipmentItem.item?.quantity && (
                        //       <Text style="label-sm" className="text-foreground/70">
                        //         Available: {equipmentItem.item.quantity}
                        //       </Text>
                        //     )}
                        //   </div>
                        // </div>
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
                      {request.song.map((songItem: any, index) => (
                        <div key={songItem.song?.id || index} className="p-3 bg-secondary/50 rounded-md">
                          <Text style="paragraph-sm">{songItem.song?.name || `Song ${index + 1}`}</Text>
                          <div className="flex gap-2 mt-2">
                            {songItem.song?.instrumental && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                                Instrumental
                              </span>
                            )}
                            {songItem.song?.lyrics && (
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
                            <Text style="paragraph-xs" className="text-foreground/50 mt-2">
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
                        className="w-full p-3 border border-foreground/15 rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-brand-solid focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || isSubmittingComment}
                          size="sm"
                        >
                          {isSubmittingComment ? "Adding..." : "Add Comment"}
                        </Button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
