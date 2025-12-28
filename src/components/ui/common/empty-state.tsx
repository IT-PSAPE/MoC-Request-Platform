import { Text } from "@/components/ui/common/text"

type EmptyStateProps = {
  title: string;
  message?: string;
  className?: string;
  icon?: React.ReactNode
};

export function EmptyState({ title = "No information", message = "This section has no content to show.", className, icon }: EmptyStateProps) {
  return (
    <div className={`w-full rounded-md bg-primary border border-secondary px-4 py-3 ${className}`}>
      {icon && <div className="mb-2">{icon}</div>}
      <div className="">
        <Text style="label-md">{title}</Text>
        <Text style="paragraph-xs" className="text-quaternary">{message}</Text>
      </div>
    </div>
  );
}
