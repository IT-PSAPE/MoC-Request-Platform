'use client';

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { IconName } from "@/components/common/icon";
import Divider from "@/components/common/divider";

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

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    const handleLinkClick = () => {
        onClose?.();
    };

    function Logo() {
        return (
            <Link href={"/"} aria-label="MOC Request Platform" className="text-brand-teriary z-20">
                <svg width="60" height="21" viewBox="0 0 60 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M52.8483 0.822912C54.3371 0.822912 55.6578 1.06267 56.8098 1.54122C57.9794 2.01972 58.9986 2.67501 59.8669 3.5079L57.0759 6.32594C56.5797 5.79422 55.9762 5.37779 55.2672 5.07648C54.5761 4.77531 53.7698 4.6243 52.8483 4.6243C52.033 4.6243 51.2797 4.76694 50.5885 5.05052C49.9151 5.31638 49.3301 5.70599 48.8338 6.21993C48.3554 6.73388 47.974 7.354 47.6904 8.08059C47.4245 8.80724 47.2923 9.60506 47.2923 10.4735C47.2923 11.3597 47.4245 12.1668 47.6904 12.8934C47.974 13.62 48.3554 14.2402 48.8338 14.7541C49.3301 15.2681 49.915 15.667 50.5885 15.9506C51.2797 16.2341 52.0331 16.3757 52.8483 16.3757C53.8054 16.3757 54.6383 16.2248 55.3473 15.9235C56.0562 15.6222 56.668 15.2058 57.182 14.6741L60 17.4921C59.0962 18.3251 58.0595 18.9813 56.8899 19.4599C55.7379 19.9384 54.3995 20.177 52.8754 20.1771C51.4752 20.1771 50.1721 19.9384 48.9669 19.4599C47.7794 18.9636 46.7336 18.2722 45.8297 17.3861C44.9435 16.4999 44.2522 15.4717 43.7559 14.3019C43.2597 13.1144 43.0117 11.8382 43.0117 10.4735C43.0117 9.1089 43.2598 7.84179 43.7559 6.67211C44.2522 5.48462 44.9435 4.45642 45.8297 3.58795C46.7159 2.71955 47.7525 2.04572 48.9398 1.56718C50.1451 1.07091 51.4482 0.822916 52.8483 0.822912Z" fill="currentColor" />
                    <path d="M31.7276 13.2385C33.1278 13.2385 34.4216 13.4876 35.609 13.9839C36.8142 14.4624 37.86 15.1444 38.7462 16.0306C39.6501 16.8991 40.3508 17.9273 40.847 19.1148C40.9886 19.4484 41.1072 19.7915 41.2084 20.1425H36.7557C36.5037 19.578 36.1761 19.0841 35.7691 18.6626C35.2729 18.1309 34.6787 17.732 33.9874 17.4661C33.314 17.1826 32.5606 17.041 31.7276 17.041C30.6111 17.041 29.6272 17.289 28.7765 17.7853C27.9436 18.2638 27.2966 18.946 26.8358 19.832C26.7821 19.9332 26.7318 20.0369 26.6843 20.1425H22.2404C22.3431 19.7822 22.4641 19.4298 22.6093 19.0877C23.1055 17.9182 23.796 16.8989 24.682 16.0306C25.5681 15.1444 26.6057 14.4624 27.7932 13.9839C28.9984 13.4876 30.3097 13.2385 31.7276 13.2385Z" fill="currentColor" />
                    <path d="M9.60948 11.4439L16.2181 1.11499H19.2222V19.885H15.0476V9.5053L10.9801 15.8435H8.21506L4.14755 9.47177V19.885H0V1.11499H2.97815L9.60948 11.4439Z" fill="currentColor" />
                    <path d="M26.164 1.05333C26.2082 1.72628 26.3339 2.35017 26.5437 2.92373C26.8095 3.65008 27.1818 4.27883 27.6601 4.81036C28.1564 5.32436 28.7506 5.72323 29.4418 6.00681C30.1329 6.29031 30.8947 6.43302 31.7276 6.43304C32.8441 6.43304 33.8187 6.18388 34.6517 5.68769C35.5024 5.19142 36.1586 4.50011 36.6194 3.61391C37.0066 2.85425 37.2295 2.00075 37.2912 1.05333H41.5783C41.5226 2.22243 41.2794 3.32469 40.847 4.35926C40.3508 5.52878 39.6592 6.55628 38.7733 7.44234C37.8871 8.31079 36.8413 8.99389 35.6361 9.49016C34.4486 9.98643 33.1631 10.2344 31.7806 10.2344C30.3628 10.2344 29.0513 9.98638 27.8462 9.49016C26.6587 8.99389 25.6129 8.30255 24.709 7.41638C23.8051 6.53022 23.1055 5.50194 22.6093 4.33222C22.1802 3.3055 21.9372 2.21254 21.8791 1.05333H26.164Z" fill="currentColor" />
                </svg>
            </Link>
        )
    }

    const links: { href: string; label: string; icon: IconName }[] = [
        { href: "/admin/", label: "Dashboard", icon: "line:home_line" },
        { href: "/admin/items/", label: "Request Items", icon: "line:dotpoints" },
        { href: "/admin/equipment/", label: "Equipment", icon: "line:tool" },
        { href: "/admin/songs/", label: "Songs", icon: "line:music_note" },
        { href: "/admin/venues/", label: "Venues", icon: "line:building" },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="w-65 flex-none flex flex-col max-md:hidden" >
                <div className="p-2 pb-0 flex-none">
                    <div className="h-13 flex items-center px-4 py-2 bg bg-primary border border-secondary rounded-lg" >
                        <Logo />
                    </div>
                </div>
                <div className="p-2 flex-1" >
                    {links.map((l) => (
                        <Link key={l.href} href={l.href}>
                            <MenuItem current={pathname === l.href}><Icon name={l.icon} />{l.label}</MenuItem>
                        </Link>
                    ))}
                </div>
                <div className="p-2 pt-0 flex-none" >
                    <Link href="/" >
                        <MenuItem current ><Icon name="line:home_line" /> Home Page</MenuItem>
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "hidden max-md:block fixed inset-0 z-50 bg-primary transition-all duration-200 ease-in-out overflow-hidden",
                    isOpen ? "left-0" : "left-full"
                )}
                data-status={isOpen ? 'open' : 'closed'}
            >
                <div className="flex flex-col h-full">
                    {/* Close button */}
                    <div className="flex justify-end p-4">
                        <button
                            type="button"
                            aria-label="Close navigation menu"
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-quaternary transition-colors text-primary"
                            onClick={onClose}
                        >
                            <Icon name="line:close" />
                        </button>
                    </div>
                    <div className="p-4 pt-0 flex-1">
                        {links.map((l) => (
                            <div key={l.href}>
                                <Link href={l.href} onClick={handleLinkClick}>
                                    <MenuItem current={pathname === l.href}><Icon name={l.icon} />{l.label}</MenuItem>
                                </Link>
                                {l.href === "/admin" && <Divider />}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 pt-0 flex-none">
                        <Link href="/" onClick={onClose}>
                            <MenuItem current ><Icon name="line:home_line" /> Home Page</MenuItem>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
