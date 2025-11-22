import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export default function Radio({ label, className, ...props }: RadioProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-5 w-5 rounded-full bg-quaternary p-0.5 has-checked:bg-brand-solid">
        <div className="h-4 w-4 rounded-full bg-primary shadow-xs relative has-checked:bg-brand-solid">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white transition-colors" />
          </div>
          <input type="radio" className={cn("absolute inset-0 appearance-none rounded-full cursor-pointer", className)} {...props} />
        </div>
      </div>
      {label && (
        <label htmlFor={props.id} className="text-sm text-primary cursor-pointer select-none" >
          {label}
        </label>
      )}
    </div>
  );
}
