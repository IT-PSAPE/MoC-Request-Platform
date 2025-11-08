import Text from "@/components/common/text";
import Header from "@/app/admin/components/header";
import { Column, KanbanBoard } from "@/components/common/kanban/kanban";
import { useDefaultContext } from "@/contexts/defaults-context";

import { useAdminContext } from "@/contexts/admin-context";

export default function RequestsContent() {
    const { statuses } = useDefaultContext();
    const { requests, updateRequestStatusOptimistic } = useAdminContext();

    const columns: Column[] = statuses.map((status) => ({ [status.id]: status.name }));

    return (
        <>
            <Header>
                <Text style="title-h4">Requests</Text>
                <Text style="paragraph-md">Drag and drop requests to update their status</Text>
            </Header>
            <KanbanBoard 
                columns={columns} 
                data={requests} 
                isDraggable={true}
                onRequestStatusChange={updateRequestStatusOptimistic}
            />
        </>
    );
}