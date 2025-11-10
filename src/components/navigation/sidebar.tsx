'use client';

import { useAdminContext } from "@/contexts/admin-context";
import { cn } from "@/lib/cn";
import Link from "next/link";
import Icon from "@/components/common/icon";
import Divider from "@/components/common/divider";

type MenuItemProps = {
    children?: React.ReactNode;
    current?: boolean;
    onClick?: () => void;
};

function MenuItem({ current, children, onClick }: MenuItemProps) {
    return (
        <div className="p-0.5 text-sm" onClick={onClick} >
            <div className={cn("px-3 py-2 border rounded-lg flex items-center gap-2 transition-shadow cursor-pointer", (current ? "bg-primary border-secondary hover:shadow-sm" : "border-transparent bg-transparent"))} >
                {children}
            </div>
        </div>
    );
}

export default function Sidebar() {
    const { tab, setTab } = useAdminContext();

    return (
        <div className="w-65 flex-none flex flex-col" >
            <div className="p-2 pb-0 flex-none">
                <div className="h-13" ></div>
            </div>
            <div className="p-2 flex-1" >
                <MenuItem onClick={() => setTab('dashboard')} current={tab === 'dashboard'} >
                    Dashboard
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setTab('request-items')} current={tab === 'request-items'}>
                    Request Items
                </MenuItem>
                <MenuItem onClick={() => setTab('equipment')} current={tab === 'equipment'}>
                    Equipment
                </MenuItem>
                <MenuItem onClick={() => setTab('songs')} current={tab === 'songs'}>
                    Songs
                </MenuItem>
                <MenuItem onClick={() => setTab('venues')} current={tab === 'venues'}>
                    Venues
                </MenuItem>
            </div>
            <div className="p-2 pt-0 flex-none" >
                <Link href="/" >
                    <MenuItem current ><Icon name="line:home_line" /> Home Page</MenuItem>
                </Link>
            </div>
        </div>
    );
}
