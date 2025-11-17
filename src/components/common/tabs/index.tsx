import { cn } from "@/lib/cn";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type TabListProps = {
    children: React.ReactElement<TabItemProps> | React.ReactElement<TabItemProps>[];
}

type TabItemProps = {
    children: React.ReactNode;
    value: string;
    onClick?: (value: string, event: React.MouseEvent) => void;
}

type TabContextType = {
    defaultTab?: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
};

export const TabContext = createContext<TabContextType | null>(null);

function TabContextProvider({ children, defaultTab }: { children: React.ReactNode, defaultTab?: string }) {
    const [value, setValue] = useState<string>(defaultTab ?? 'null');

    const context: TabContextType = { defaultTab, value, setValue };

    return (
        <TabContext.Provider value={context}>
            {children}
        </TabContext.Provider>
    );
}

export function useTabContext() {
    const context = useContext(TabContext);

    if (!context) throw new Error("useTabContext must be used within a TabContextProvider");

    return context;
}

function TabItem({ children, value, onClick }: TabItemProps) {
    const { value: tabValue, defaultTab, setValue } = useTabContext();

    useEffect(() => {
        if (defaultTab === 'null') setValue(value);
    }, [defaultTab, value, setValue]);


    function handleClick(event: React.MouseEvent) {
        if (tabValue === value) return;

        if (onClick) onClick(value, event);

        setValue(value);
    }

    return (
        <div className={cn("h-8 flex items-center justify-center px-3 py-1 rounded-md label-sm", tabValue === value ? "text-primary bg-primary" : "text-quaternary")} onClick={handleClick}>
            {children}
        </div>
    );
}

function TabList({ children }: TabListProps) {
    return (
        <div className="flex p-0.5 gap-0.5 bg-secondary border border-secondary rounded-lg *:flex-1 w-full">
            {children}
        </div>
    );
}

export { TabContextProvider, TabItem, TabList };
