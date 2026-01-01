"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/cn";

type BreadcrumbItemProps = {
    children: React.ReactNode;
    current?: boolean;
    href?: string;
};

function BreadcrumbItem({ children, current, href }: BreadcrumbItemProps) {
    const Component = href && !current ? Link : "div";
    return (
        <Component 
            href={href}
            className={cn(
                "min-w-5 text-sm flex justify-center",
                href && !current && "hover:text-secondary transition-colors cursor-pointer"
            )}
        >
            {children}
        </Component>
    );
}

export function Breadcrumbs() {
    const pathname = usePathname();
    
    const getBreadcrumbs = () => {
        if (pathname === "/") return [];
        
        const segments = pathname.split("/").filter(Boolean);
        const breadcrumbs: { label: string; href: string; current: boolean }[] = [];
        
        // Build breadcrumb trail
        let currentPath = "";
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            
            // Convert URL segment to human-readable label
            let label = segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            breadcrumbs.push({
                label,
                href: currentPath,
                current: index === segments.length - 1
            });
        });
        
        return breadcrumbs;
    };
    
    const breadcrumbs = getBreadcrumbs();
    
    // Don't show breadcrumbs on home page or if there are no breadcrumbs
    if (breadcrumbs.length === 0) {
        return null;
    }
    
    return (
        <div className="h-13 flex items-center px-6 py-4 border-b border-secondary sticky top-0 bg-primary mobile:hidden">
            {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.href} className="flex items-center">
                    <BreadcrumbItem 
                        current={breadcrumb.current}
                        href={breadcrumb.current ? undefined : breadcrumb.href}
                    >
                        {breadcrumb.label}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                        <BreadcrumbItem>/</BreadcrumbItem>
                    )}
                </div>
            ))}
        </div>
    );
}