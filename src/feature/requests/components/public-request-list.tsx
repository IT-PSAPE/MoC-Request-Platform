import { FilterProvider } from "@/components/ui/block/request-list";
import { RequestListProps } from "@/components/ui/block/request-list/request-list";
import { RequestListA } from "@/components/ui/block/request-list/request-list";

export function PublicRequestList(props: RequestListProps) {
    return (
        <FilterProvider>
            <RequestListA.Provider {...props}>
                <RequestListA.Layout>
                    <RequestListA.Controls>
                        <RequestListA.ViewTab />
                    </RequestListA.Controls>
                    <RequestListA.List />
                </RequestListA.Layout>
            </RequestListA.Provider>
        </FilterProvider>
    );
}