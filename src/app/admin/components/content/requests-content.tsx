import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import Header from "../../components/header";

export default function RequestsContent() {
    return (
        <>
            <Header>
                <Text style="title">Requests</Text>
                <Text style="body">Supporting Text</Text>
            </Header>
            <div className="p-6" >
                <EmptyState message="No requests available" />
            </div>
        </>
    );
}