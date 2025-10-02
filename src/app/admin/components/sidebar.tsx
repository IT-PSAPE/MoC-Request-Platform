import { SetStateAction } from "react";

type AdminTabs = "requests" | "equipment"

type Props = {
    tab: AdminTabs;
    setTab: (value: SetStateAction<AdminTabs>) => void
}

function Sidebar({tab, setTab}: Props) {
    return (
        <aside className="w-48 shrink-0 pl-4">
            <div className="text-2xl font-semibold mb-4">Admin</div>
            <div className="space-y-2 text-sm">
                <button
                    className={`w-full text-left rounded-md px-2 py-1 ${tab === "requests" ? "bg-foreground/10" : "hover:bg-foreground/5"}`}
                    onClick={() => setTab("requests")}
                >
                    Requests
                </button>
                <button
                    className={`w-full text-left rounded-md px-2 py-1 ${tab === "equipment" ? "bg-foreground/10" : "hover:bg-foreground/5"}`}
                    onClick={() => setTab("equipment")}
                >
                    Equipment
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;