
import MainContent from "@/components/layout/main-content";
import RequestsContent from "./requests-content";
import EquipmentContent from "./equipment-content";
import VenueContent from "./venues-content";
import SongContent from "./songs-content";
import { useAdminContext } from "../../admin-provider";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import RequestItemContent from "./request-item-content";

export default function AdminMainContent() {
    const { tab } = useAdminContext();

    function Render() {
        switch (tab) {
            case 'request-items':
                return <RequestItemContent />;
            case 'dashboard':
                return <RequestsContent />;
            case 'equipment':
                return <EquipmentContent />;
            case 'venues':
                return <VenueContent />;
            case 'songs':
                return <SongContent />;
        }
    }

    return (
        <MainContent >
            <Breadcrumbs />
            <Render />
        </MainContent>
    );
}