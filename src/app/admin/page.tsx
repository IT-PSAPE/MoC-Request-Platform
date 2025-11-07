"use client"

import { AdminContextProvider } from "./admin-provider";
import { useDefaultContext } from "@/components/providers/default-provider";
import Sidebar from "@/components/ui/sidebar/sidebar";
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