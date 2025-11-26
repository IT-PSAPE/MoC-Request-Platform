'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button';
import ErrorLayout from '@/components/common/error-layout';
import ErrorIcon from '@/components/common/icons/error-icon';

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
      icon={<ErrorIcon />}
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
