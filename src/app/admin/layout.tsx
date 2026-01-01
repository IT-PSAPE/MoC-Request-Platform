import { Metadata } from 'next';
import { AuthGuard } from '@/feature/auth';
import AdminLayoutClient from '@/components/ui/layout/admin-layout-client';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin - MoC Request Platform',
    default: 'Admin Dashboard | MoC Request Platform',
  },
  description: 'Administrative dashboard for managing Ministry of Culture requests',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </AuthGuard>
  );
}
