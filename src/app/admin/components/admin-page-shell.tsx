"use client";

import { useState } from "react";
import Sidebar from "@/components/navigation/sidebar";
import { AdminContextProvider } from "@/contexts/admin-context";
import { useDefaultContext } from "@/contexts/defaults-context";
import AdminMainContent from "./content/admin-main-content";

export default function AdminPageShell() {
  const { supabase } = useDefaultContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function MenuBar() {
    const barClass =
      "absolute left-0 block h-[2px] rounded-md w-full bg-[currentColor] transition-all duration-200 ease-in-out origin-center transition-all ";

    return (
      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
        className="hidden w-8 h-6 relative z-20 max-md:flex cursor-pointer items-center justify-center bg-transparent border-0 p-0 text-foreground"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        data-status={isMobileMenuOpen ? "open" : "closed"}
      >
        <span
          className={`${barClass} ${isMobileMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}
        />
        <span
          className={`${barClass} top-1/2 -translate-y-1/2 ${isMobileMenuOpen ? "scale-x-0" : "scale-x-100"}`}
        />
        <span
          className={`${barClass} ${isMobileMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`}
        />
      </button>
    );
  }

  return (
    <AdminContextProvider supabase={supabase}>
      <div className="hidden max-md:flex max-md:sticky max-md:top-0 max-md:z-10 max-md:bg-primary max-md:border-b max-md:border-secondary max-md:px-4 max-md:py-3">
        <MenuBar />
      </div>

      <div className="flex w-full h-full max-md:h-fit">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <AdminMainContent />
      </div>
    </AdminContextProvider>
  );
}
