import { SelectHTMLAttributes } from "react";
import { cn } from "@/shared/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

// Native HTML select (deprecated - use CustomSelect instead)
export function NativeSelect({ className, children, ...props }: Props) {
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
export function NativeOption({...props}: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>) {
  return (
    <option {...props} />
  );
}