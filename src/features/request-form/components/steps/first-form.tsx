import FormField from "../form-field";
import { useFormContext } from "@/components/contexts/form-context";
import { TextArea, TextInput } from "../input";
import Divider from "@/components/ui/common/divider";

export default function FirstForm() {
    const { request, setRequest } = useFormContext();

    function handleWhoChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRequest((request) => {
            return { ...request, who: event.target.value }
        })
    }

    function handleWhatChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRequest((request) => {
            return { ...request, what: event.target.value }
        })
    }

    function handleWhenChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRequest((request) => {
            return { ...request, when: event.target.value }
        })
    }

    function handleWhereChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRequest((request) => {
            return { ...request, where: event.target.value }
        })
    }

    function handleWhyChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setRequest((request) => {
            return { ...request, why: event.target.value }
        })
    }

    function handleHowChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setRequest((request) => {
            return { ...request, how: event.target.value }
        })
    }

    function handleInfoChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setRequest((request) => {
            return { ...request, info: event.target.value }
        })
    }

    return (
        <>
            <FormField label="Who" description="Full name or organization">
                <TextInput placeholder="Who is making the request?" onChange={handleWhoChange} value={request.who} />
            </FormField>
            <Divider />
            <FormField label="What" description="Describe the task or deliverable.">
                <TextInput placeholder="What is being requested?" onChange={handleWhatChange} value={request.what} />
            </FormField>
            <Divider />
            <FormField label="When" description="Deadlines, dates, or time window.">
                <TextInput placeholder="When is it needed?" onChange={handleWhenChange} value={request.when} />
            </FormField>
            <Divider />
            <FormField label="Where" description="Location or channel.">
                <TextInput placeholder="Where will this be used?" onChange={handleWhereChange} value={request.where} />
            </FormField>
            <Divider />
            <FormField label="Why" description="Goals, context, or problem being solved.">
                <TextArea placeholder="Why is this needed?" onChange={handleWhyChange} value={request.why} />
            </FormField>
            <Divider />
            <FormField label="How" description="Constraints, process, or preferred approach.">
                <TextArea placeholder="How should it be done?" onChange={handleHowChange} value={request.how} />
            </FormField>
            <Divider />
            <FormField label="Additional Info" description="Anything else we should know?">
                <TextArea placeholder="Anything else we should know?" onChange={handleInfoChange} value={request.info || ""} />
            </FormField>
        </>
    )
}