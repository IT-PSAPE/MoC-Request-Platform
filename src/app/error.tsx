'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/controls/button';
import Text from '@/components/common/text';
import ErrorLayout from '@/components/navigation/error-layout';
import Icon from '@/components/common/icon';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <ErrorLayout
      icon={
        <div className="mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
          <Icon name="alert_triangle" size={16} />
        </div>
      }
      title="Oops! Something went wrong"
      description="We encountered an unexpected error. Don't worry, you can try refreshing the page or return to the home page."
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
      footer={
        <Text style="paragraph-sm" className="text-tertiary mt-8">
          If this problem persists, please contact support.
        </Text>
      }
    />
  );
}
