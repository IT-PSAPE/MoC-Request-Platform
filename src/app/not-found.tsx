import Link from 'next/link';
import { Button, Text } from '@/components/ui';
import ErrorLayout from '@/components/navigation/error-layout';

export default function NotFound() {
  return (
    <ErrorLayout
      icon={
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
          <Text style="title-h1" className="text-primary">
            404
          </Text>
        </div>
      }
      title="Page Not Found"
      description="Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist."
      actions={
        <>
          <Link href="/">
            <Button variant="primary" className="w-full sm:w-auto">
              Go to Home
            </Button>
          </Link>
          <Link href="/board">
            <Button variant="secondary" className="w-full sm:w-auto">
              View Requests
            </Button>
          </Link>
        </>
      }
      footer={
        <div className="pt-8 space-y-2">
          <Text style="paragraph-sm" className="text-tertiary">
            Quick Links:
          </Text>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/form" className="text-brand-solid hover:text-brand-hover transition-colors">
              Submit Request
            </Link>
            <Link href="/admin" className="text-brand-solid hover:text-brand-hover transition-colors">
              Admin Dashboard
            </Link>
            <Link href="/login" className="text-brand-solid hover:text-brand-hover transition-colors">
              Login
            </Link>
          </div>
        </div>
      }
    />
  );
}
