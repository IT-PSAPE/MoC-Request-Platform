import { cn } from "@/lib/cn";

const statusColor: Record<number, string> = {
  0: "bg-gray-500",
  1: "bg-blue-500",
  2: "bg-yellow-500",
  3: "bg-green-600",
  4: "bg-red-500",
};

interface RequestCardProps extends React.HTMLAttributes<HTMLDivElement> {
  request: FetchRequest;
  setActive: (r: FetchRequest) => void;
}

function RequestCard({ request: r, setActive, className, onClick, onDragStart, ...divProps }: RequestCardProps) {
  const title = r.what || "Request";
  const description = r.why || r.how || "";
  const totalQty = (r.item || []).length;
  const headerType = r.type ? r.type.name.replace(/_/g, " ") : "Request";
  const headerDate = formatDateMDY(r.due || r.created_at);
  const footerDate = formatDateDayMon(r.created_at);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    setActive(r);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", r.id);
    onDragStart?.(event);
  };


  function StatusBadge() {
    return (
      <span className="inline-flex items-center gap-2 rounded-md border border-secondary bg-secon px-3 py-1 text-xs text-primary/80">
        <span className={cn("h-2 w-2 rounded-full", statusColor[r.status.value])} />
        <span className="capitalize">{r.status.name.replace(/_/g, " ")}</span>
      </span>
    )
  }

  return (
    <div
      {...divProps}
      className={cn("space-y-3 p-3 rounded-lg border border-gray-200 bg-white shadow-sm", className)}
      onClick={handleClick}
      onDragStart={handleDragStart}
    >
      {/* Header pill */}
      <div className="inline-flex rounded-md bg-gray-50 px-3 py-1 text-xs items-center text-gray-700">
        <span className="capitalize">{headerType} • {headerDate}</span>
      </div>

      <div className="space-y-1">
        {/* Title */}
        <div className="text-xl font-semibold tracking-tight">{title}</div>
        {/* Description */}
        {description && <p className="text-[13px] leading-5 text-primary/80 line-clamp-3 overflow-hidden"> {description} </p>}
      </div>

      {/* Status pill */}
      <div><StatusBadge /></div>

      {/* Footer with icons */}
      <div className="flex items-center gap-6 text-sm text-primary/80 border-t border-secondary pt-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-quaternary" />
          <span className="text-[13px]">{footerDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <CubeIcon className="h-4 w-4 text-quaternary" />
          <span className="text-[13px]">{totalQty}</span>
        </div>
      </div>
    </div>
  );
}

function formatDateMDY(iso: string | undefined) {
  try {
    const d = new Date(iso || "");
    if (isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;
  } catch {
    return "";
  }
}

function formatDateDayMon(iso: string | undefined) {
  try {
    const d = new Date(iso || "");
    if (isNaN(d.getTime())) return "";
    return `${d.getDate()} ${d.toLocaleString(undefined, { month: "short" })}`;
  } catch {
    return "";
  }
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" ry="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  );
}

function CubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 2l8 4-8 4-8-4 8-4z" />
      <path d="M4 6v8l8 4 8-4V6" />
    </svg>
  );
}

export default RequestCard
