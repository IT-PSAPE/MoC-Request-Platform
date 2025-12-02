'use client';

import { useAuthContext } from '@/contexts/auth-context';
import Loader from '@/components/common/loader';

interface SmartRedirectProps {
  children: React.ReactNode;
}

export default function SmartRedirect({
  children,
}: SmartRedirectProps) {
  const { initialized } = useAuthContext();

  if (!initialized) {
    return <Loader label="Loading..." className="flex-1" />;
  }

  return <>{children}</>;
}
