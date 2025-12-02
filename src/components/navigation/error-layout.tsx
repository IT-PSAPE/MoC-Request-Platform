import { ReactNode } from 'react';
import Text from '@/components/common/text';
import Header from '@/components/common/header';

interface ErrorLayoutProps {
  icon: ReactNode;
  title: string;
  description: string;
  errorId?: string;
  actions: ReactNode;
  footer?: ReactNode;
}

export default function ErrorLayout({
  icon,
  title,
  description,
  errorId,
  actions,
  footer,
}: ErrorLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          {icon}
          
          <Header>
            <Text style="title-h4">{title}</Text>
            <Text style="paragraph-md" className="text-secondary">
              {description}
            </Text>
          </Header>
        </div>

        {errorId && (
          <Text style="paragraph-sm" className="text-tertiary">
            Error ID: {errorId}
          </Text>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actions}
        </div>

        {footer}
      </div>
    </div>
  );
}
