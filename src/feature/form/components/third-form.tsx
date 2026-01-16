'use client';

import { Button, EmptyState, Icon, Text } from "@/components/ui";
import { FilleUploader } from "@/components/ui";
import { useFormContext } from "./form-context";
import FormField from "./form-field";
import FlowField from "./flow-field";
import { useEffect, useMemo, useRef, useState } from "react";

export function ThirdForm() {
    const { request, setRequest, files, setFiles } = useFormContext();

    function handleStepDelete(index: number) {
        setRequest((prev) => {
            return {
                ...prev,
                flow: prev.flow.filter((_, i) => i !== index)
            }
        });
    }

    function handleAddStep() {
        setRequest((prev) => {
            return {
                ...prev,
                flow: [...prev.flow, ``]
            }
        })
    }

    function handleStepChange(index: number, value: string) {
        setRequest((prev) => {
            return {
                ...prev,
                flow: prev.flow.map((v, i) => i === index ? value : v)
            }
        });
    }


    return (
        <div className="space-y-8">
            <FormField label="Event Flow" description="(optional)" mode="column">
                <div className="space-y-4">
                    {
                        request.flow.length < 1 ?
                            <EmptyState title={"No information"} />
                            : request.flow.map((s, i) => {
                                return (
                                    <FlowField
                                        key={i}
                                        index={i + 1}
                                        value={s}
                                        handleStepDelete={() => handleStepDelete(i)}
                                        handleChange={(event) => handleStepChange(i, event.target.value)}
                                    />
                                )
                            })
                    }
                    <div className="flex justify-center">
                        <Button type="button" variant="secondary" onClick={handleAddStep}>
                            <Icon.plus size={20}/>Add Step
                        </Button>
                    </div>
                </div>
            </FormField>

            <FormField label="Attachments" description="(optional)" mode="column">
                <FilleUploader
                    files={files}
                    onFilesChange={setFiles}
                    maxFiles={10}
                    maxFileSizeBytes={10 * 1024 * 1024}
                    disabled={false}
                />
            </FormField>
        </div>
    )
}
