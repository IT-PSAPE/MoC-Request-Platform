import { cn } from "@/lib/cn";
import Icon, { IconName } from "./icon";
import Text from "./text";

interface InlineAlertProps {
    message: string;
    description?: string;
    type?: 'notice' | 'warning' | 'error' | 'success' | 'info';
}

function InlineAlert({ message, description, type = 'notice' }: InlineAlertProps) {

    let icon: IconName = 'alert';
    let color = '';

    switch (type) {
        case 'notice':
            icon = 'alert';
            color = 'bg-pink-50 border-pink-300 text-pink-900';
            break;
        case 'info':
            icon = 'alert';
            color = 'bg-gray-50 border-gray-300 text-gray-900';
            break;
        case 'warning':
            icon = 'alert';
            color = 'bg-yellow-50 border-yellow-300 text-yellow-900';
            break;
        case 'error':
            icon = 'alert';
            color = 'bg-red-50 border-red-300 text-red-900';
            break;
        case 'success':
            icon = 'alert';
            color = 'bg-green-50 border-green-300 text-green-900';
            break;
    }

    return <div className={cn("flex items-center gap-4 px-5 py-2 rounded-lg border", color)}>
        <div className="flex items-center justify-center h-6 w-6">
            <Icon name={icon} />
        </div>
        <div className="">
            <Text style="label-sm">{message}</Text>
            {description ? <Text style="paragraph-sm" className="opacity-70">{description}</Text> : null}
        </div>
    </div>;
}

export default InlineAlert;