'use client';

import { useEffect } from 'react';
import Button from '@/components/common/controls/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Critical Error</h1>
                <p className="text-secondary">
                  A critical error occurred in the application. Please refresh the page to continue.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={reset}
                variant="primary"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
