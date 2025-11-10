"use client"

import { AdminContextProvider } from "@/contexts/admin-context";
import { useDefaultContext } from "@/contexts/defaults-context";
import Sidebar from "@/components/navigation/sidebar";
import AdminMainContent from "./components/content/admin-main-content";

function AdminLayout() {
  const { supabase } = useDefaultContext();

  return (
    <AdminContextProvider supabase={supabase} >
      <div className="flex w-full h-full" >
        <Sidebar />
        <AdminMainContent ></AdminMainContent>
      </div>
    </AdminContextProvider>
  );
}

export default AdminLayout;