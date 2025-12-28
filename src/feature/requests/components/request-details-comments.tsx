'use client';


import { EmptyState, Text } from "@/components/ui/common";
import { formatDate, type RequestDetailsBaseProps } from "../request.utils";

export default function RequestDetailsComments({
  request
}: RequestDetailsBaseProps) {

  return (
    <section>
      <Text style="label-md" className="mb-3">Comments</Text>

      {/* Existing Comments */}
      {request.note && request.note.length > 0 ? (
        <div className="space-y-1 mb-4">
          {request.note.map((note, index) => (
            <div key={note.id || index} className="p-2 bg-secondary rounded-md">
              <Text style="paragraph-sm">{note.note}</Text>
              <Text style="paragraph-xs" className="text-tertiary">{formatDate(note.created)}</Text>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No comments yet"
          message="Use the pencil icon at the top to add a comment."
        />
      )}
    </section>
  );
}
