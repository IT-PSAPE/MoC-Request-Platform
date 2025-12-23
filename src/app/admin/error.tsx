'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/controls/button';
import ErrorLayout from '@/components/navigation/error-layout';
import Icon from '@/components/common/icon';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  return (
    <ErrorLayout
      icon={
        <div className="mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
          <Icon.alert_triangle size={16} />
        </div>
      }
      title="Admin Error"
      description="An error occurred in the admin dashboard. You can try again or return to the main admin page."
      errorId={error.digest}
      actions={
        <>
          <Button
            onClick={reset}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.push('/admin')}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Admin Dashboard
          </Button>
        </>
      }
    />
  );
}
