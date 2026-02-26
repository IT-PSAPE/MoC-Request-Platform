"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, Icon, IconButton } from "@/components/ui";
import { useAuthContext } from "@/feature/auth/components/auth-context";
import { cn } from "@/shared/cn";

export default function NavigationBar() {
  const { authed } = useAuthContext();

  const pathname = usePathname();

  const links: { href: string; label: string; icon: React.ReactNode }[] = [
    { href: "/", label: "Home", icon: <Icon.home_line size={20} /> },
    { href: "/form", label: "Form", icon: <Icon.pen_line size={20} /> },
    { href: "/board", label: "Requests Board", icon: <Icon.clipboard size={20} /> },
  ];

  function Links() {
    const handleLinkClick = () => {
      setIsMenuOpen(false);
    };

    return (
      <div className="flex gap-1 p-0.5 rounded-lg w-full max-w-[420px] border border-gray-200 bg-gray-50 mx-auto mobile:contents">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={handleLinkClick}
            className={cn(`flex gap-1.5 items-center justify-center mobile:justify-start px-4 py-1.5 mobile:py-2 rounded-md text-sm grow text-center leading-1.2 border ${pathname === l.href ? 'border-gray-200 bg-white drop-shadow-sm' : 'border-transparent text-gray-500'}`)}
          >
            {l.icon}
            {l.label}
          </Link>
        ))}
      </div>
    )
  }

  function Actions() {
    const handleActionClick = () => {
      setIsMenuOpen(false);
    };

    return (
      authed
        ? (
          <Link
            href="/admin"
            onClick={handleActionClick}
          >
            <Button variant='secondary' className="mobile:w-full">Dashboard</Button>
          </Link>
        )
        : (
          <Link
            href="/login"
            onClick={handleActionClick}
          >
            <Button variant='secondary' className="mobile:w-full">Login</Button>
          </Link>
        )
    )
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-10">
      <div className="mx-auto max-w-[1280px] px-4 py-3 flex items-center gap-4 mobile:bg-primary">
        <div className="w-full max-w-[120px] relative z-1 mobile:max-w-full">
          <Link href={"/"} aria-label="MOC Request Platform" className="text-brand-teriary z-20 mobile:hidden">
            <Icon.moc size={60} />
          </Link>
          <div
            className="hidden mobile:block border border-primary rounded-full w-fit bg-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <IconButton variant="ghost" >
              <Icon.menu size={24} />
            </IconButton>
          </div>
        </div>
        <div
          className="contents fixed inset-0 flex-col justify-between gap-4 bg-primary mobile:flex transition-all duration-200 ease-in-out mobile:p-4 mobile:pt-16 mobile:w-full mobile:data-[status=closed]:left-full"
          data-status={isMenuOpen ? 'open' : 'closed'}
        >
          <div className="w-full mobile:w-full mobile:flex mobile:flex-col mobile:gap-4"><Links /></div>
          <div className="w-full max-w-[120px] text-sm mobile:max-w-full"><Actions /></div>
        </div>
      </div>
    </nav>
  );
}
