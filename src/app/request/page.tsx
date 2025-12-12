'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSupabaseClient } from '@/hooks/use-supabase-client';
import AuthGuard from '@/components/navigation/auth-guard';
import Text from '@/components/common/text';
import Button from '@/components/common/controls/button';
import Badge from '@/components/common/badge';
import Loader from '@/components/common/loader';
import InlineAlert from '@/components/common/inline-alert';
import Divider from '@/components/common/divider';
import EmptyState from '@/components/common/empty-state';
import Link from 'next/link';
import { RequestTable } from '@/lib/database';
import Icon from '@/components/common/icon';

// Color maps from request details sheet
const requestColorMap: Record<string, BadgeColor> = {
  "Video Filming & Production": "teal",
  "Video Editing": "yellow",
  "Design Flyer": "pink",
  "Video Filming": "green",
  "Equipment": "orange",
  "Event": "blue",
  "Design Special": "purple",
};

const priorityColorMap: Record<string, BadgeColor> = {
  "Low": "blue",
  "Medium": "yellow",
  "High": "orange",
  "Urgent": "red",
};

const statusColorMap: Record<string, BadgeColor> = {
  "Not Started": "gray",
  "In Progress": "orange",
  "Completed": "green",
};

function RequestDetailsContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id')?.replace('/', '');
  const supabase = useSupabaseClient();

  const [request, setRequest] = useState<FetchRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequest() {
      if (!requestId || !supabase) {
        setLoading(false);
        setError('No request ID provided');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await RequestTable.get(supabase, requestId);

        if (error) {
          setError('Failed to load request');
          return;
        }

        if (!data) {
          setError('Request not found');
          return;
        }

        setRequest(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();
  }, [requestId, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <Text style="paragraph-sm" className="text-secondary">
            Loading request details...
          </Text>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <Text style="title-h2" className="mb-4">
            {error === 'Request not found' ? 'Request Not Found' : 'Error'}
          </Text>
          <InlineAlert
            type="error"
            message={error || 'Request not found'}
          />
          <div className="mt-6">
            <Link href="/">
              <Button>
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="w-full max-w-container-sm mx-auto p-6 px-margin py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/board">
          <Button>
            <Icon name='arrow_left' /> Back
          </Button>
        </Link>
      </div>

      {/* Content with same structure as request details sheet */}
      <div className="space-y-6">
        {/* Overview Section - matches RequestDetailsOverview */}
        <section className="space-y-5">
          <Text style="title-h6">{request.what || "Untitled Request"}</Text>
          <div className="space-y-4 *:w-full *:gap-sm *:grid *:grid-cols-2 *:items-center">
            <div>
              <span className="flex items-center gap-1.5">
                <Text style="label-sm" className="text-secondary">Status</Text>
              </span>
              <span>

                <Badge color={statusColorMap[request.status.name] || "gray"}>
                  {request.status.name}
                </Badge>
              </span>
            </div>
            <div>
              <span className="flex items-center gap-1.5">
                <Text style="label-sm" className="text-secondary">Priority</Text>
              </span>
              <span>
                <Badge color={priorityColorMap[request.priority.name] || "gray"}>
                  {request.priority.name}
                </Badge>
              </span>
            </div>
            <div>
              <span className="flex items-center gap-1.5">
                <Text style="label-sm" className="text-secondary">Type</Text>
              </span>
              <span>
                <Badge color={requestColorMap[request.type.name] || "gray"}>
                  {request.type.name}
                </Badge>
              </span>
            </div>
            <div>
              <span className="flex items-center gap-1.5">
                <Text style="label-sm" className="text-secondary">Due Date</Text>
              </span>
              <Text style="paragraph-sm">{formatDate(request.due)}</Text>
            </div>
            {request.assignee && request.assignee.length > 0 && (
              <div className="col-span-2">
                <span className="flex items-center gap-1.5">
                  <Text style="label-sm" className="text-secondary">Assigned Team Members</Text>
                </span>
                <div className="flex flex-wrap gap-1">
                  {request.assignee.map((assigneeItem) => (
                    <Badge key={assigneeItem.member_id} color="blue">
                      {assigneeItem.member.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <Divider />

        {/* 5Ws and 1H Section - matches RequestDetails5WH */}
        <section>
          <Text style="label-md" className="mb-3">5Ws and 1H</Text>
          <div className="space-y-3">
            <div>
              <Text as="span" style="label-sm">Who: </Text>
              <Text as="span" style="paragraph-sm" className="text-tertiary">{request.who || "Not specified"}</Text>
            </div>
            <div>
              <Text as="span" style="label-sm">What: </Text>
              <Text as="span" style="paragraph-sm" className="text-tertiary">{request.what || "Not specified"}</Text>
            </div>
            <div>
              <Text as="span" style="label-sm">When: </Text>
              <Text as="span" style="paragraph-sm" className="text-tertiary">{request.when || "Not specified"}</Text>
            </div>
            <div>
              <Text as="span" style="label-sm">Where: </Text>
              <Text as="span" style="paragraph-sm" className="text-tertiary">{request.where || "Not specified"}</Text>
            </div>
            <div>
              <Text as="span" style="label-sm">Why: </Text>
              <Text as="span" style="paragraph-sm" className="text-tertiary">{request.why || "Not specified"}</Text>
            </div>
            <div>
              <Text as="span" style="label-sm">How: </Text>
              <Text as="span" style="paragraph-sm" className="text-tertiary">{request.how || "Not specified"}</Text>
            </div>
            {request.info && (
              <div>
                <Text as="span" style="label-sm">Additional Information: </Text>
                <Text as="span" style="paragraph-sm" className="text-tertiary">{request.info}</Text>
              </div>
            )}
          </div>
        </section>

        <Divider />

        {/* Venues Section - matches RequestDetailsVenues */}
        <section>
          <Text style="label-md" className="mb-3">Available Venues</Text>
          {request.venue && request.venue.length > 0 ? (
            <div className="space-y-1">
              {request.venue.map((venue: RequestedVenue, index) => (
                <div key={venue.venue?.id || index} className="p-2 bg-secondary rounded-md">
                  <Text style="paragraph-sm">{venue.venue?.name || `Venue ${index + 1}`}</Text>
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

        {/* Equipment Section - matches RequestDetailsEquipment */}
        <section>
          <Text style="label-md" className="mb-3">Selected Equipment</Text>
          {request.item && request.item.length > 0 ? (
            <div className="space-y-1">
              {request.item.map((equipment: RequestedItem, index) => (
                <div key={equipment.item?.id || index} className="p-2 bg-secondary rounded-md">
                  <Text style="paragraph-sm">{equipment.item?.name || `Item ${index + 1}`}</Text>
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

        {/* Songs Section - matches RequestDetailsSongs */}
        <section>
          <Text style="label-md" className="mb-3">Selected Songs</Text>
          {request.song && request.song.length > 0 ? (
            <div className="space-y-1">
              {request.song.map((song: RequestedSong, index) => (
                <div key={song.song?.id || index} className="p-2 bg-secondary rounded-md">
                  <Text style="paragraph-sm">{song.song?.name || `Song ${index + 1}`}</Text>
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

        {/* Comments Section - matches RequestDetailsComments */}
        <section>
          <Text style="label-md" className="mb-3">Comments</Text>
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
              message="No comments have been added to this request."
            />
          )}
        </section>
      </div>
    </div>
  );
}

function RequestDetailsWithAuth() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <Text style="paragraph-sm" className="text-secondary">
            Loading request details...
          </Text>
        </div>
      </div>
    }>
      <RequestDetailsContent />
    </Suspense>
  );
}

export default function RequestDetailsPage() {
  return (
    <AuthGuard>
      <RequestDetailsWithAuth />
    </AuthGuard>
  );
}
