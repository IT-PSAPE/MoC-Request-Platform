import { cn } from "@/lib/cn";
import Badge from "../badge";

interface RequestListItemProps {
  request: FetchRequest;
  onRequestClick?: (request: FetchRequest) => void;
  className?: string;
  isPublicView?: boolean;
}

export function RequestListItem({ 
  request, 
  onRequestClick, 
  className, 
  isPublicView = false 
}: RequestListItemProps) {
  const title = request.what || "Request";
  const description = request.why || request.how || "";
  const requestType = request.type ? request.type.name.replace(/_/g, " ") : "Request";

  const handleClick = () => {
    if (onRequestClick) {
      onRequestClick(request);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3 rounded-md",
        className,
        isPublicView 
          ? "bg-white border border-gray-200" 
          : "bg-primary hover:bg-secondary transition-colors cursor-pointer"
      )}
      onClick={!isPublicView ? handleClick : undefined}
    >
      {/* Left side - Title and description */}
      <div className="flex-1 min-w-0 max-w-md">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{description}</p>
        )}
      </div>

      {/* Right side - Type badge - Always show request type */}
      <Badge color="gray">
        {requestType}
      </Badge>
    </div>
  );
}

