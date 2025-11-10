import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  color?: "gray" | "green" | "yellow" | "red" | "blue";
};

const colorMap = {
  gray: "bg-foreground/10 text-foreground",
  green: "bg-green-600/20 text-green-500",
  yellow: "bg-yellow-500/20 text-yellow-500",
  red: "bg-red-500/20 text-red-500",
  blue: "bg-blue-500/20 text-blue-400",
};

export default function Badge({ children, color = "gray" }: Props) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colorMap[color])}>
      {children}
    </span>
  );
}
