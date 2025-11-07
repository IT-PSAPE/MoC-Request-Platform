import Text from "@/components/ui/text";
import Header from "@/app/admin/components/header";
import { Column, KanbanBoard } from "@/components/ui/kanban/kanban";
import { useDefaultContext } from "@/components/providers/default-provider";

import { useBoardContext } from "../board-provider";

export default function RequestsContent() {
    const { statuses } = useDefaultContext();
    const { requests } = useBoardContext();

    const columns: Column[] = statuses.map((status) => ({ [status.id]: status.name }));

    return (
        <>
            <Header>
                <Text style="title-h4">Requests</Text>
                <Text style="paragraph-md">Supporting Text</Text>
            </Header>
            <KanbanBoard columns={columns} data={requests} />
        </>
    );
}