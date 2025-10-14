import Divider from "../divider";
import FormField from "../form-field";
import { TextArea, TextInput } from "../input";

export default function FirstForm() {
    return (
        <>
            <FormField label="Who" description="Full name or organization">
                <TextInput placeholder="Who is making the request?" />
            </FormField>
            <Divider />
            <FormField label="What" description="Describe the task or deliverable.">
                <TextInput placeholder="What is being requested?" />
            </FormField>
            <Divider />
            <FormField label="When" description="Deadlines, dates, or time window.">
                <TextInput placeholder="When is it needed?" />
            </FormField>
            <Divider />
            <FormField label="Where" description="Location or channel.">
                <TextInput placeholder="Who is making the request?" />
            </FormField>
            <Divider />
            <FormField label="Why" description="Goals, context, or problem being solved.">
                <TextInput placeholder="Why is this needed?" />
            </FormField>
            <Divider />
            <FormField label="How" description="Constraints, process, or preferred approach.">
                <TextArea placeholder="How should it be done?" />
            </FormField>
            <Divider />
            <FormField label="Additional Info" description="Anything else we should know?">
                <TextArea placeholder="Anything else we should know?" />
            </FormField>
        </>
    )
}