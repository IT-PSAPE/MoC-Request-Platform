import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import Header from "../../components/header";

export default function EquipmentContent() {
    return (
        <>
            <Header>
                <Text style="title">Equipment</Text>
                <Text style="body">Supporting Text</Text>
            </Header>
            <div className="p-6" >
                <EmptyState message="No equipment available" />
            </div>
        </>
    );
}

