import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/shared/cn";

type TextStyle =
  | "title-h1"
  | "title-h2"
  | "title-h3"
  | "title-h4"
  | "title-h5"
  | "title-h6"
  | "label-lg"
  | "label-bg"
  | "label-md"
  | "label-sm"
  | "label-xs"
  | "paragraph-lg"
  | "paragraph-bg"
  | "paragraph-md"
  | "paragraph-sm"
  | "paragraph-xs"
  | "subheading-bg"
  | "subheading-md"
  | "subheading-sm"
  | "subheading-xs";

type TextTag =
  | "div"
  | "span"
  | "p"
  | "li"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

type TextProps<T extends TextTag = "div"> = {
  as?: T;
  children?: ReactNode;
  style?: TextStyle;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children" | "style">;

export function Text<T extends TextTag = "div">({ as, children, style, className, ...props }: TextProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component className={cn(style, className)} {...props}>
      {children}
    </Component>
  );
}