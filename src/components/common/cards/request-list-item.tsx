import { cn } from "@/lib/cn";
import Badge from "../badge";
import Text from "@/components/common/text";

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
        "group flex items-center justify-between p-3 rounded-md flex-wrap gap-2",
        className,
        isPublicView
          ? "bg-white border border-gray-200"
          : "bg-primary hover:bg-secondary transition-colors cursor-pointer"
      )}
      onClick={!isPublicView ? handleClick : undefined}
    >
      {/* Left side - Title and description */}
      <div className="w-full max-w-md">
        <Text style="label-md" className="text-primary">{title}</Text>
        {description && (<Text style="paragraph-xs" className="text-sm text-gray-500 line-clamp-1 mt-0.5">{description}</Text>)}
      </div>

      {/* Right side - Type badge - Always show request type */}
      <Badge color="gray">{requestType}</Badge>
    </div>
  );
}

