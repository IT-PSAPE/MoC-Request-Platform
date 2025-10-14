import { InputHTMLAttributes } from "react";
import Icon from "./icon";
import { cn } from "@/lib/cn";

export default function Checkbox({ ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {

    return (
        <div className="h-4 w-4 rounded-sm bg-tertiary p-0.5 relative has-checked:bg-brand-solid">
            <div className="h-3 w-3 rounded-xs bg-primary shadow-xs text-transparent has-checked:text-white has-checked:bg-brand-solid" >
                <Icon name="line:check" size={12} />
                <input type="checkbox" className={cn("absolute inset-0 appearance-none", props.className)} {...props} />
            </div>
        </div>
    )
}