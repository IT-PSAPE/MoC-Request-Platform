'use client';

import { useEffect } from 'react';

export default function OfflinePage() {
  useEffect(() => {
    document.title = 'Offline - MoC Request Platform';
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-8">
      <div className="max-w-[448px] text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-tertiary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-1.061 1.061M5.636 18.364l1.061-1.061M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M7.05 7.05L5.636 5.636M18.364 18.364L16.95 16.95"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-primary mb-4">
          You&rsquo;re Offline
        </h1>
        
        <p className="text-tertiary mb-6">
          It looks like you&rsquo;ve lost your internet connection. Don&rsquo;t worry - you can still view previously loaded content.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-brand-solid text-brand-contrast px-4 py-2 rounded-lg font-medium hover:bg-brand-solid-hover transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-muted text-primary px-4 py-2 rounded-lg font-medium hover:bg-muted-hover transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
