'use client';

import { EquipmentContextProvider } from "@/feature/equipment/components/equipment-context";
import { ItemsContextProvider } from "@/feature/items/components/items-context";
import { RequestContextProvider } from "@/feature/requests/components/request-context";
import { SongsContextProvider } from "@/feature/songs/components/songs-context";
import { VenuesContextProvider } from "@/feature/venues/components/venue-context";

export function AdminContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <EquipmentContextProvider>
            <ItemsContextProvider>
                <VenuesContextProvider>
                    <SongsContextProvider>
                        <RequestContextProvider>
                            {children}
                        </RequestContextProvider>
                    </SongsContextProvider>
                </VenuesContextProvider>
            </ItemsContextProvider>
        </EquipmentContextProvider>
    );
}
