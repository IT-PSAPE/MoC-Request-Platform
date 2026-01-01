'use client';

import { cn } from "@/shared/cn";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Divider, Icon, IconButton } from "@/components/ui/common";

type MenuItemProps = {
    children?: React.ReactNode;
    current?: boolean;
    onClick?: () => void;
};

type SidebarProps = {
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
        <Link href={"/"} aria-label="MOC Request Platform" className="text-brand-teriary z-20">
            <Icon.moc size={60} />
        </Link>
    )
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    const handleLinkClick = () => {
        onClose?.();
    };



    const links: { href: string; label: string; icon: React.ReactNode }[] = [
        { href: "/admin/", label: "Dashboard", icon: <Icon.home_line size={24} /> },
        { href: "/admin/items/", label: "Request Items", icon: <Icon.dotpoints size={24} /> },
        { href: "/admin/equipment/", label: "Equipment", icon: <Icon.tool size={24} /> },
        { href: "/admin/songs/", label: "Songs", icon: <Icon.music_note size={24} /> },
        { href: "/admin/venues/", label: "Venues", icon: <Icon.building size={24} /> },
    ];


    return (
        <>
            <div className="w-65 flex-none flex flex-col mobile:hidden" >
                <div className="p-2 pb-0 flex-none">
                    <div className="h-13 flex items-center px-4 py-2 bg bg-primary border border-secondary rounded-lg" >
                        <Logo />
                    </div>
                </div>
                <div className="p-2 flex-1" >
                    {links.map((l) => (
                        <Link key={l.href} href={l.href}>
                            <MenuItem current={pathname === l.href}>{l.icon}{l.label}</MenuItem>
                        </Link>
                    ))}
                </div>
                <div className="p-2 pt-0 flex-none" >
                    <Link href="/" >
                        <MenuItem current ><Icon.home_line size={24} /> Home Page</MenuItem>
                    </Link>
                </div>
            </div>
            <NavigationTop className="hidden mobile:block"/>
        </>
    );
}

function NavigationTop({ className }: { className?: string }) {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/board");
        }
    };

    return (
        <div className={cn("px-margin py-4 sticky top-0 bg-gradient-to-b from-primary to-primary/0 z-10", className)}>
            <div className="flex items-center gap-3">
                <div className="bg-primary border border-gray-200 rounded-full">
                    <IconButton variant="ghost" onClick={handleBack}>
                        <Icon.arrow_left size={20} />
                    </IconButton>
                </div>
                {/* <div className="ml-auto bg-primary border border-gray-200 rounded-full px-1 spacer-x-1">
                    <IconButton variant="ghost">
                        <Icon.pen_line size={20} />
                    </IconButton>
                    <IconButton variant="ghost">
                        <Icon.archive size={20} />
                    </IconButton>
                    <IconButton variant="ghost">
                        <Icon.trash size={20} />
                    </IconButton>
                </div> */}
            </div>
        </div>
    );
}