'use client';

import { cn } from "@/shared/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, Text, Button } from "@/components/ui/common";
import { useAuthContext } from "@/feature/auth/components/auth-context";

// Shared admin navigation links
const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard", icon: Icon.home_line },
    { href: "/admin/items", label: "Request Items", icon: Icon.dotpoints },
    { href: "/admin/equipment", label: "Equipment", icon: Icon.tool },
    { href: "/admin/songs", label: "Songs", icon: Icon.music_note },
    { href: "/admin/venues", label: "Venues", icon: Icon.building },
] as const;

type MenuItemProps = {
    children?: React.ReactNode;
    current?: boolean;
    onClick?: () => void;
};

type NavigationProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

function MenuItem({ current, children, onClick }: MenuItemProps) {
    return (
        <div className="p-0.5 text-sm" onClick={onClick} >
            <div className={cn("px-3 py-2 border rounded-lg flex items-center gap-2 transition-shadow cursor-pointer", (current ? "bg-primary border-secondary" : "border-transparent bg-transparent"))} >
                {children}
            </div>
        </div>
    );
}

function Logo() {
    return (
        <Link href={"/"} aria-label="MOC Request Platform" className="z-20 w-9 h-9 rounded-full bg-linear-to-t from-pink-600 to-pink-400 text-white flex items-center justify-center">
            <Icon.moc size={28} />
        </Link>
    )
}

export default function Navigation({ isOpen = false, onClose }: NavigationProps) {
    const pathname = usePathname();

    return (
            <div className="w-65 flex-none flex flex-col border-r border-secondary bg-secondary mobile:bg-primary" >
                <div className="h-13 flex items-center gap-2 px-4 py-2 bg border-b border-secondary" >
                    <Logo />
                    <Text style='label-sm' className="">Port Elizabeth Church</Text>
                </div>
                <div className="contents mobile:flex">
                    <div className="p-2 flex-1" >
                        {ADMIN_LINKS.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <MenuItem current={pathname === link.href}>
                                    <link.icon size={24} />
                                    {link.label}
                                </MenuItem>
                            </Link>
                        ))}
                    </div>
                    <div className="p-2 pt-0 flex-none" >
                        <Link href="/" >
                            <MenuItem current ><Icon.home_line size={24} /> Home Page</MenuItem>
                        </Link>
                    </div>
                </div>
            </div>
    );
}