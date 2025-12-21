'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/contexts/auth-context';
import Loader from '../common/loader';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ 
  children, 
  fallback
}: AuthGuardProps) {
  const { authed, initialized } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !authed) {
      // Redirect unauthenticated users to home page
      router.push('/');
    }
  }, [initialized, authed, router]);

  // Show loading while authentication is being initialized
  if (!initialized) {
    return fallback || <Loader label="Authenticating..." className="flex-1" />;
  }

  // Show loading while redirecting unauthenticated users
  if (!authed) {
    return fallback || <Loader label="Redirecting..." className="flex-1" />;
  }

  return <>{children}</>;
}
