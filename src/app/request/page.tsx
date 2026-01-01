'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, EmptyState, Text, Badge, Loader, InlineAlert, Divider, Icon } from '@/components/ui';
import { RequestTable } from '@/shared/database';
import { useSupabaseClient } from '@/logic/hooks/use-supabase-client';
import { AuthGuard } from '@/feature/auth';
import RequestDetails5WH from '@/feature/requests/components/request-details-5wh';
import RequestDetailsVenues from '@/feature/requests/components/request-details-venues';
import RequestDetailsEquipment from '@/feature/requests/components/request-details-equipment';
import RequestDetailsSongs from '@/feature/requests/components/request-details-songs';
import RequestDetailsFlow from '@/feature/requests/components/request-details-flow';
import RequestDetailsComments from '@/feature/requests/components/request-details-comments';
import RequestDetailsOverview from '@/feature/requests/components/request-details-overview';
import { useRequestContext } from '@/feature/requests/components/request-context';

function RequestDetailsContent({ requestId }: { requestId: string | null }) {
  const { updateRequestStatusOptimistic, updateRequestPriorityOptimistic, updateRequestTypeOptimistic, updateRequestDueDateOptimistic, assignMemberToRequest, unassignMemberFromRequest } = useRequestContext();
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

      {/* Content with same structure as request details sheet */}
      <div className="space-y-6">
        {/* Overview Section - matches RequestDetailsOverview */}
        <RequestDetailsOverview
          request={request}
          onUpdateStatus={updateRequestStatusOptimistic}
          onUpdatePriority={updateRequestPriorityOptimistic}
          onUpdateType={updateRequestTypeOptimistic}
          onUpdateDueDate={updateRequestDueDateOptimistic}
          onAssignMember={assignMemberToRequest}
          onUnassignMember={unassignMemberFromRequest}
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
        />

      </div>
    </div>
  );
}

function RequestDetailsWithParams() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id')?.replace('/', '') || null;
  
  return <RequestDetailsContent requestId={requestId} />;
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
      <RequestDetailsWithParams />
    </Suspense>
  );
}

export default function RequestDetailsPage() {
  return (
    <AuthGuard redirect='/board'>
      <RequestDetailsWithAuth />
    </AuthGuard>
  );
}
