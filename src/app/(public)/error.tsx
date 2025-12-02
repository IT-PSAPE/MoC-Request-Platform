'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/controls/button';
import ErrorLayout from '@/components/navigation/error-layout';
import Icon from '@/components/common/icon';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Public route error:', error);
  }, [error]);

  return (
    <ErrorLayout
      icon={
        <div className="mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
          <Icon name="alert_triangle" size={16} />
        </div>
      }
      title="Something went wrong"
      description="We encountered an error while loading this page."
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
            onClick={() => router.push('/')}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Go to Home
          </Button>
        </>
      }
    />
  );
}
