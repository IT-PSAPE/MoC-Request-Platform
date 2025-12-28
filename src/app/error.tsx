'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ErrorLayout from '@/components/navigation/error-layout';
import { Button, Icon, Text } from '@/components/ui';

type ErrorProp = {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProp) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <ErrorLayout
      icon={
        <div className="mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
          <Icon.alert_triangle size={16} />
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
