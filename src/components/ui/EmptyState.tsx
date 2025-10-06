type EmptyStateProps = {
  title?: string;
  message?: string;
  className?: string;
};

export default function EmptyState({ title = "No information", message = "This section has no content to show.", className = "" }: EmptyStateProps) {
  return (
    <div className={`w-full rounded-md bg-foreground/5 text-foreground/70 text-sm px-3 py-2 ${className}`}>
      <div className="font-medium">{title}</div>
      <div className="text-xs mt-0.5">{message}</div>
    </div>
  );
}
