import React, { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={cn(
        "w-full p-2.5 bg-primary border border-primary rounded-lg shadow-sm paragraph-sm",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}


function Option({...props}: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>) {
  return (
    <option {...props} />
  );
}

export { Option }