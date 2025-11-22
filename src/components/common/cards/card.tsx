import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
};

export default function Card({ title, children, className, footer }: Props) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white shadow-sm", className)}>
      {title && (
        <div className="border-b border-secondary px-2 py-2 text-sm font-medium">
          {title}
        </div>
      )}
      <div className="p-2">{children}</div>
      {footer && <div className="border-t border-secondary px-4 py-2">{footer}</div>}
    </div>
  );
}
