import { createContext, useContext, useEffect, useState } from "react";
import { useDefaultContext } from "@/components/contexts/defaults-context";
import { EquipmentTable } from "@/shared/database";

type EquipmentContextType = {
    equipment: Equipment[];
    updateEquipment: (id: string, available: number) => void;
};

const EquipmentContext = createContext<EquipmentContextType | null>(null);

export function useAdminContext() {
    const context = useContext(EquipmentContext);

    if (!context) throw new Error("useAdminContext must be used within a AdminContextProvider");

    return context;
}

export function AdminContextProvider({ children }: { children: React.ReactNode}) {
    const { supabase } = useDefaultContext();

    const [equipment, setEquipment] = useState<Equipment[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const equipmentResult = await EquipmentTable.select(supabase);

                if (!isMounted) return;

                if (equipmentResult.error) {
                    console.error("Failed to load statuses", equipmentResult.error);
                } else {
                    setEquipment((equipmentResult.data ?? []) as Equipment[]);
                }

            } catch (error) {
                if (!isMounted) return;
                console.error("Unexpected error loading defaults", error);
            }
        };

        void loadDefaults();

        // TEMPORARILY ADDED: Refetch data when window gains focus to ensure fresh data
        const handleFocus = () => {
            void loadDefaults();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            isMounted = false;
            window.removeEventListener('focus', handleFocus);
        };
    }, [supabase]);


    const updateEquipment = async (id: string, available: number) => {
        const { error } = await EquipmentTable.update(supabase, id, { available });

        if (error) {
            console.error("Failed to update equipment", error);
            return;
        }

        setEquipment((prevEquipment) =>
            prevEquipment.map((eq) =>
                eq.id === id ? { ...eq, available } : eq
            )
        );
    }

    const context: EquipmentContextType = {
        equipment,
        updateEquipment,
    }

    return (
        <EquipmentContext.Provider value={context}>
            { children }
        </EquipmentContext.Provider>
    )
}