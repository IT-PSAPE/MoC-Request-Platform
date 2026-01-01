'use client';

import { cn } from "@/shared/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, IconButton, Button } from "@/components/ui/common";
import { useAuthContext } from "@/feature/auth/components/auth-context";

// Shared admin navigation links
const ADMIN_LINKS = [
    { href: "/admin/", label: "Dashboard", icon: Icon.home_line },
    { href: "/admin/items/", label: "Request Items", icon: Icon.dotpoints },
    { href: "/admin/equipment/", label: "Equipment", icon: Icon.tool },
    { href: "/admin/songs/", label: "Songs", icon: Icon.music_note },
    { href: "/admin/venues/", label: "Venues", icon: Icon.building },
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
        <Link href={"/"} aria-label="MOC Request Platform" className="text-brand-teriary z-20">
            <Icon.moc size={60} />
        </Link>
    )
}

export default function Navigation({ isOpen = false, onClose }: NavigationProps) {
    const pathname = usePathname();
    const { authed } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClose = () => setIsMenuOpen(false);

    const renderMobileLinks = () => (
        <div className="flex flex-col gap-2 w-full">
            {ADMIN_LINKS.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleMenuClose}
                    className={cn(
                        "flex gap-3 items-center px-4 py-3 rounded-md text-sm border transition-colors",
                        pathname === link.href 
                            ? 'border-gray-200 bg-white drop-shadow-sm' 
                            : 'border-transparent text-gray-500 hover:bg-gray-50'
                    )}
                >
                    <link.icon size={20} />
                    {link.label}
                </Link>
            ))}
        </div>
    );

    const renderMobileActions = () => (
        authed ? (
            <Link href="/admin" onClick={handleMenuClose} className="w-full">
                <Button variant='secondary' className="w-full">Dashboard</Button>
            </Link>
        ) : (
            <Link href="/login" onClick={handleMenuClose} className="w-full">
                <Button variant='secondary' className="w-full">Login</Button>
            </Link>
        )
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="w-65 flex-none flex flex-col mobile:hidden" >
                <div className="p-2 pb-0 flex-none">
                    <div className="h-13 flex items-center px-4 py-2 bg bg-primary border border-secondary rounded-lg" >
                        <Logo />
                    </div>
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

            {/* Mobile Navigation */}
            <div className="hidden mobile:block px-margin py-4 sticky top-0 bg-gradient-to-b from-primary to-primary/0 z-10">
                <div className="flex items-center gap-3">
                    <div 
                        className="bg-primary border border-gray-200 rounded-full"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <IconButton variant="ghost">
                            <Icon.menu size={20} />
                        </IconButton>
                    </div>
                </div>
                
                {/* Mobile Menu Overlay */}
                <div
                    className={cn(
                        "fixed inset-0 flex flex-col justify-between gap-4 bg-primary p-4 pt-20 w-full transition-all duration-200 ease-in-out z-20",
                        isMenuOpen ? "left-0" : "left-full"
                    )}
                >
                    <div className="w-full flex flex-col gap-4">
                        {renderMobileLinks()}
                    </div>
                    <div className="w-full">
                        {renderMobileActions()}
                    </div>
                </div>
            </div>
        </>
    );
}