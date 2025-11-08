import { InputHTMLAttributes } from "react";
import Icon from "./icon";
import { cn } from "@/lib/cn";

export default function Checkbox({ onChange, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
    return (
        <div className="h-5 w-5 rounded-sm bg-quaternary p-0.5 relative has-checked:bg-brand-solid">
            <div className="h-4 w-4 rounded-xs bg-primary shadow-xs text-transparent has-checked:text-white has-checked:bg-brand-solid" >
                <Icon name="line:check" size={16} />
                <input type="checkbox"
                    className={cn("absolute inset-0 appearance-none rounded-[inherit]", props.className)}
                    {...props}
                    onChange={onChange || (e => e.stopPropagation())}
                />
            </div>
        </div>
    )
}