import Icon from "@/components/common/icon";
import { TextArea } from "./input";
import Text from "@/components/common/text";

type FlowFieldProps = {
    index: number;
    handleStepDelete: () => void;
    handleChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    value: string;
}

export default function FlowField({ index, handleStepDelete, handleChange, value}: FlowFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <Text style="paragraph-sm" className="text-quaternary ml-2">Step {index}</Text>
            <div className="flex items-center gap-1">
                <TextArea placeholder="Describe the step..." className="h-40" onChange={handleChange} value={value} />
                <div className="p-2 text-quaternary hover:text-error hover:bg-error-primary rounded-md cursor-pointer" onClick={() => handleStepDelete()}>
                    <Icon.trash />
                </div>
            </div>
        </div>
    )
}