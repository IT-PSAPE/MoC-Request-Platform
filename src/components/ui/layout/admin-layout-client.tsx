"use client";

import { useState } from 'react';
import { AdminContextProvider } from '@/components/contexts/admin-context';
import Sidebar from '@/components/navigation/sidebar';
import MainContent from '@/components/ui/layout/main-content';
import { Breadcrumbs } from '@/components/ui/common/breadcrumbs';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AdminContextProvider>
      <div className="flex w-full h-full mobile:flex-col">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <MainContent>
          <Breadcrumbs />
          {children}
        </MainContent>
      </div>
    </AdminContextProvider>
  );
}
