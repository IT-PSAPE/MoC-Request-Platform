import { cn } from "@/lib/cn";
import Text from "@/components/ui/text";

type Props = {
    label: string;
    description: string;
    children: React.ReactNode;
    mode?: "grid" | "column";
};

export default function FormField({ label, description, children, mode = "grid" }: Props) {

    const style = {
        grid: "grid grid-cols-1 sm:grid-cols-5 gap-6 items-start",
        column: "space-y-4",
    }[mode];

    return (
        <div className={cn(style)}>
            <div className="sm:col-span-2">
                {label && <Text style="label-md">{label}</Text>}
                {description && <Text style="paragraph-sm" className="text-quaternary" >{description}</Text>}
            </div>
            <div className="sm:col-span-3">{children}</div>
        </div>
    )
}