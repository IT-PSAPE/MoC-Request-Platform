import React, { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

// Native HTML select (deprecated - use CustomSelect instead)
function NativeSelect({ className, children, ...props }: Props) {
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

// Native HTML option (deprecated - use SelectOption from custom-select instead)
function Option({...props}: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>) {
  return (
    <option {...props} />
  );
}

// Re-export the custom select as the default
export { Select as default, SelectOption as Option } from "./custom-select";
export { NativeSelect, Option as NativeOption };