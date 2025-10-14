import EmptyState from "@/components/ui/EmptyState";
import FormField from "../form-field";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import FlowField from "../flow-field";

export default function FormThree() {
    const [steps, setSteps] = useState<string[]>([]);

    function handleStepDelete(index: number) {
        setSteps((prev) => prev.filter((_, i) => i !== index));
    }


    return (
        <FormField label="Event Flow" description="(optional)" mode="column">
            <div className="space-y-4">
                {
                    steps.length < 1 ?
                        <EmptyState />
                        : steps.map((s, i) => {
                            return (
                                <FlowField key={i} index={i + 1} handleStepDelete={() => handleStepDelete(i)} />
                            )
                        })
                }
                <div className="flex justify-center">
                    <Button type="button" variant="secondary" onClick={() => setSteps((prev) => [...prev, `Step ${steps.length + 1}`])}>
                        <Icon name="line:plus" /> Add Step
                    </Button>
                </div>
            </div>
        </FormField>
    )
}