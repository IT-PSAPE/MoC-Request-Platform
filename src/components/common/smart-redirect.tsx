'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/auth-context';
import Loader from './loader';

interface SmartRedirectProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export default function SmartRedirect({ 
  children, 
  redirectPath = '/admin' 
}: SmartRedirectProps) {
  const { authed, initialized } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if authentication is initialized and user is logged in
    if (initialized && authed) {
      router.push(redirectPath);
    }
  }, [initialized, authed, router, redirectPath]);

  // Show loading while authentication is being initialized
  if (!initialized) {
    return <Loader label="Loading..." className="flex-1" />;
  }

  // If user is authenticated, show loading during redirect
  if (authed) {
    return <Loader label="Redirecting to admin..." className="flex-1" />;
  }

  // User is not authenticated, show the children (public content)
  return <>{children}</>;
}
