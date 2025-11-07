import Icon from "./icon";

function InlineAlert({ message }: { message: string }) {
    return <div className="flex gap-4 px-5 py-2 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-900">
        <div className="flex items-center justify-center h-6 w-6">
            <Icon name="line:alert" />
        </div>
        <div className="flex flex-col gap-1">
            <p className="font-medium">{message}</p>
        </div>
    </div>;
}

export default InlineAlert;