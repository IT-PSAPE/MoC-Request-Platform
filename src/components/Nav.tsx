"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Auth } from "@/features/auth/auth";

export default function Nav() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(Auth.isAuthed());
  }, []);

  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/form", label: "Form" },
    { href: "/requests", label: "Requests" },
  ];
  return (
    <nav className="sticky top-0 z-10 backdrop-blur border-b border-foreground/10 bg-background/70">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <div className="w-full max-w-[120px]"></div>
        <div className="flex gap-3 text-sm mx-auto w-full max-w-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 rounded-md px-2 py-1 text-center ${pathname === l.href ? "text-foreground bg-foreground/10" : "text-foreground/70 hover:text-foreground hover:bg-foreground/4"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="w-full max-w-[120px] text-sm ">
          {authed && (
            <Link
              href="/admin"
              className={`w-full inline-block flex-1 rounded-md px-2 py-1 text-center ${pathname === '/admin' ? "text-foreground bg-foreground/10" : "text-foreground/70 hover:text-foreground hover:bg-foreground/4"}`}
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
