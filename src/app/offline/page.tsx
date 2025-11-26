'use client';

import Button from '@/components/common/button';
import ErrorLayout from '@/components/common/error-layout';
import OfflineIcon from '@/components/common/icons/offline-icon';
import { useEffect } from 'react';

export default function OfflinePage() {
  useEffect(() => {
    document.title = 'Offline - MoC Request Platform';
  }, []);

  return (
    <ErrorLayout
      icon={<OfflineIcon />}
      title="You're Offline"
      description="It looks like you've lost your internet connection. Don't worry - you can still view previously loaded content."
      actions={
        <>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
        </>
      }
    />
  );
}
