import Link from 'next/link';
import Button from '@/components/common/button';
import Text from '@/components/common/text';
import ErrorLayout from '@/components/common/error-layout';
import NotFoundIcon from '@/components/common/icons/not-found-icon';

export default function NotFound() {
  return (
    <ErrorLayout
      icon={<NotFoundIcon />}
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
