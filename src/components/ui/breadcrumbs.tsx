import { cn } from "@/lib/cn";

type BreadcrumbItemProps = {
    children: React.ReactNode;
    current?: boolean;
};

function BreadcrumbItem({ children }: BreadcrumbItemProps) {
    return (
        <div className={cn("min-w-5 text-sm flex justify-center",)} >{children}</div>
    );
}

export default function Breadcrumbs() {
    return (
        <div className="h-13 flex items-center px-6 py-4 border-b border-secondary" >
            <BreadcrumbItem>Admin</BreadcrumbItem>
            <BreadcrumbItem>/</BreadcrumbItem>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
        </div>
    );
}