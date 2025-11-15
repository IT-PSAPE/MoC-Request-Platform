import Text from "@/components/common/text";
import Header from "@/app/admin/components/header";
import { useBoardContext } from "@/contexts/board-context";
import { RequestList } from "@/components/common/request-list/request-list";

export default function RequestsListView() {
    const { requests } = useBoardContext();

    return (
        <div className="space-y-6">
            <Header>
                <Text style="title-h4">Requests</Text>
                <Text style="paragraph-md">Track each request as it moves from intake through completion.</Text>
            </Header>
            <div className="px-4">
                <RequestList 
                    requests={requests} 
                    onRequestClick={undefined} // No click handler for public view
                    isPublicView={true} // Indicate this is a public view
                />
            </div>
        </div>
    );
}
