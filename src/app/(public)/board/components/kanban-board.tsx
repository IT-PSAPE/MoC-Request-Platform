import Text from "@/components/common/text";
import Header from "@/app/admin/components/header";
import { Column, KanbanBoard } from "@/components/common/kanban/kanban";
import { useDefaultContext } from "@/contexts/defaults-context";
import { useBoardContext } from "@/contexts/board-context";

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
