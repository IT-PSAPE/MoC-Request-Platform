import Text from "@/components/common/text";
import Header from "@/app/admin/components/header";
import { useBoardContext } from "@/contexts/board-context";
import { RequestList } from "@/components/common/request-list/request-list";

export default function RequestsListView() {
    const { requests } = useBoardContext();

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <Header>
                <Text style="title-h4">Requests</Text>
                <Text style="paragraph-md">Track each request as it moves from intake through completion.</Text>
            </Header>
            <RequestList
                requests={requests}
                onRequestClick={undefined} // No click handler for public view
                isPublic={true} // Indicate this is a public view (no drag-and-drop)
            />
        </div>
    );
}
