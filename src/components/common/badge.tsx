import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  indicator?: boolean;
  color?: BadgeColor;
  className?: string;
};

export default function Badge({ children, color = "gray", indicator, className }: Props) {
  const colorMap = {
    gray: "bg-utility-gray-100 text-utility-gray-600",
    green: "bg-utility-green-100 text-utility-green-600",
    yellow: "bg-utility-yellow-100 text-utility-yellow-600",
    red: "bg-utility-red-100 text-utility-red-600",
    blue: "bg-utility-blue-100 text-utility-blue-600",
    purple: "bg-utility-purple-100 text-utility-purple-600",
    pink: "bg-utility-pink-100 text-utility-pink-600",
    teal: "bg-utility-teal-100 text-utility-teal-600",
    orange: "bg-utility-orange-100 text-utility-orange-600",
    slate: "bg-utility-slate-100 text-utility-slate-600",
  };

  return (
    <span className={cn("inline-flex items-center paragraph-xs rounded-sm px-2 py-0.5 gap-1.5 text-nowrap", colorMap[color], className)}>
      {indicator && <span className={cn("h-1.5 w-1.5 rounded-full bg-current")} />}
      <span className="flex items-center gap-1">
        {children}
      </span>
    </span>
  );
}
