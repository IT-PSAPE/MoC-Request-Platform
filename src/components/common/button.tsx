import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-brand-solid text-background hover:bg-brand-solid-hover",
    secondary: "bg-transparent border border-gray-200 text-foreground hover:bg-foreground/5",
    ghost: "bg-transparent text-foreground hover:bg-foreground/10",
    destructive: "bg-error-solid text-white hover:bg-error-solid-hover",
  } as const;
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  } as const;

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

export function IconButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const base = "inline-flex items-center justify-center rounded-md";
  const variants = {
    primary: "bg-brand-solid text-background hover:bg-brand-solid-hover",
    secondary: "bg-transparent border border-gray-200 text-foreground hover:bg-foreground/5",
    ghost: "bg-transparent text-foreground hover:bg-foreground/10",
    destructive: "bg-error-solid text-white hover:bg-error-solid-hover",
  } as const;
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  } as const;

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}