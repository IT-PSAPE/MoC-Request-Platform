import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useState } from "react";

function AddNote({ onAdd }: { onAdd: (message: string) => void }) {
    const [message, setMessage] = useState("");
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!message.trim()) return;
                onAdd(message.trim());
                setMessage("");
            }}
            className="space-y-2"
        >
            <Textarea
                placeholder="Add a note for the team..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant="secondary" className="w-full">
                Add Note
            </Button>
        </form>
    );
}

export default AddNote;