import { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const base = "inline-flex items-center justify-center gap-1 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-brand-solid text-white hover:bg-brand-solid-hover",
    secondary: "bg-transparent border border-gray-200 text-primary bg-secondary",
    ghost: "bg-transparent text-primary hover:bg-quaternary",
    destructive: "bg-error-solid text-white hover:bg-error-solid-hover",
  } as const;
  const sizes = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-lg",
    lg: "h-12 px-6 text-base rounded-xl",
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
  const base = "inline-flex items-center justify-center";
  const variants = {
    primary: "bg-brand-solid text-white hover:bg-brand-solid-hover",
    secondary: "bg-transparent border border-gray-200 text-primary bg-secondary",
    ghost: "bg-transparent text-primary hover:bg-quaternary",
    destructive: "bg-error-solid text-white hover:bg-error-solid-hover",
  } as const;
  const sizes = {
    sm: "h-8 w-8 rounded-md",
    md: "h-10 w-10 rounded-lg",
    lg: "h-12 w-12 rounded-xl",
  } as const;

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}