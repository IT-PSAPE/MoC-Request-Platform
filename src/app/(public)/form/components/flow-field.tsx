import Icon from "@/components/ui/icon";
import { TextInput } from "./input";
import Text from "@/components/ui/text";

export default function FlowField({ index, handleStepDelete }: { index: number, handleStepDelete: () => void }) {
    return (
        <div>
            <Text style="paragraph-sm" className="text-quaternary">Step {index}</Text>
            <div className="flex items-center gap-1">
                <TextInput placeholder="Describe the step..." />
                <div className="p-2 text-quaternary hover:text-error hover:bg-error-primary rounded-md cursor-pointer" onClick={() => handleStepDelete()}>
                    <Icon name="line:trash" />
                </div>
            </div>
        </div>
    )
}