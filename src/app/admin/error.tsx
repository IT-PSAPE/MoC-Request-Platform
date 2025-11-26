'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button';
import ErrorLayout from '@/components/common/error-layout';
import ErrorIcon from '@/components/common/icons/error-icon';

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
      icon={<ErrorIcon />}
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
