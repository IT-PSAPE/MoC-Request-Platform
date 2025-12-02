import Link from 'next/link';
import Button from '@/components/common/controls/button';
import Text from '@/components/common/text';
import ErrorLayout from '@/components/navigation/error-layout';

export default function AdminNotFound() {
  return (
    <ErrorLayout
      icon={
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
          <Text style="title-h1" className="text-primary">
            404
          </Text>
        </div>
      }
      title="Admin Page Not Found"
      description="The admin page you're looking for doesn't exist or you don't have permission to access it."
      actions={
        <>
          <Link href="/admin">
            <Button variant="primary" className="w-full sm:w-auto">
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="w-full sm:w-auto">
              Go to Home
            </Button>
          </Link>
        </>
      }
      footer={
        <div className="pt-8 space-y-2">
          <Text style="paragraph-sm" className="text-tertiary">
            Admin Quick Links:
          </Text>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/admin/requests" className="text-brand-solid hover:text-brand-hover transition-colors">
              Requests
            </Link>
            <Link href="/admin/venues" className="text-brand-solid hover:text-brand-hover transition-colors">
              Venues
            </Link>
            <Link href="/admin/equipment" className="text-brand-solid hover:text-brand-hover transition-colors">
              Equipment
            </Link>
            <Link href="/admin/songs" className="text-brand-solid hover:text-brand-hover transition-colors">
              Songs
            </Link>
          </div>
        </div>
      }
    />
  );
}
