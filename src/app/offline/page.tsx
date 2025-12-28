'use client';

import { useEffect } from 'react';
import ErrorLayout from '@/components/navigation/error-layout';
import { Button, Icon } from '@/components/ui';

export default function OfflinePage() {
  useEffect(() => {
    document.title = 'Offline - MoC Request Platform';
  }, []);

  return (
    <ErrorLayout
      icon={
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4 text-tertiary">
          <Icon.wifi_off />
        </div>
      }
      title="You're Offline"
      description="It looks like you've lost your internet connection. Don't worry - you can still view previously loaded content."
      actions={
        <>
          <Button onClick={() => window.location.reload()} variant="primary" className="w-full sm:w-auto">
            Try Again
          </Button>
          <Button onClick={() => window.history.back()} variant="secondary" className="w-full sm:w-auto">
            Go Back
          </Button>
        </>
      }
    />
  );
}
