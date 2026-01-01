import { cn } from "@/shared/cn";
import { Badge, Icon, Text } from "@/components/ui/common";

interface RequestListItemProps {
  request: FetchRequest;
  onRequestClick?: (request: FetchRequest) => void;
  className?: string;
  isPublicView?: boolean;
}

export function RequestListItem({ request, onRequestClick, className, isPublicView = false }: RequestListItemProps) {
  const title = request.what || "Request";
  const description = request.why || request.how || "";
  const requestType = request.type ? request.type.name.replace(/_/g, " ") : "Request";
  const date = request.due ? new Date(request.due).toLocaleDateString() : "";

  const requestColorMap: Record<string, BadgeColor> = {
    "Video Filming & Production": "teal",
    "Video Editing": "yellow",
    "Design Flyer": "pink",
    "Video Filming": "green",
    "Equipment": "orange",
    "Event": "blue",
    "Design Special": "purple",
  };

  const priorityColorMap: Record<string, BadgeColor> = {
    "Low": "blue",
    "Medium": "yellow",
    "High": "orange",
    "Urgent": "red",
  };

  const handleClick = () => {
    if (onRequestClick) { onRequestClick(request); }
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3 rounded-md flex-wrap gap-2 bg-primary cursor-pointer",
        className,
        isPublicView
          ? ""
          : "cursor-pointer"
      )}
      onClick={!isPublicView ? handleClick : undefined}
    >
      {/* Left side - Title and description */}
      <div className="w-full max-w-[448px]">
        <Text style="label-sm" className="text-primary line-clamp-1">{title}</Text>
        {description && (<Text style="paragraph-xs" className="text-sm text-quaternary line-clamp-2 mt-0.5">{description}</Text>)}
      </div>

      {/* Right side - Type badge - Always show request type */}
      <div className="flex flex-wrap gap-2 *:flex *:gap-1">
        <Badge color={requestColorMap[request.type?.name] || "gray"}>
          <Icon.tag size={14} />{requestType}
        </Badge>
        <Badge color={priorityColorMap[request.priority.name] || "gray"}>
          <Icon.dropdown size={14} />{request.priority.name}
        </Badge>
        <Badge color="gray">
          <Icon.calendar size={14} />{date}
        </Badge>
      </div>
    </div>
  );
}

