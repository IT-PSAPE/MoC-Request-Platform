"use client";

import { useState } from 'react';
import { AdminContextProvider } from '@/components/contexts/admin-context';
import Sidebar from '@/components/navigation/sidebar';
import MainContent from '@/components/ui/layout/main-content';
import { Breadcrumbs } from '@/components/ui/common/breadcrumbs';
import { Icon, IconButton } from '../common';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AdminContextProvider>
      <div className="flex w-full h-full mobile:flex-col">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <MainContent>
          <div className='h-13 sticky top-0 z-10 border-b flex items-center gap-3 px-6 py-4 border-secondary mobile:hidden'>
            <IconButton size='sm' variant='ghost'>
              <Icon.layout_left size={16} />
            </IconButton>
            <Breadcrumbs />
          </div>
          {children}
        </MainContent>
      </div>
    </AdminContextProvider>
  );
}
