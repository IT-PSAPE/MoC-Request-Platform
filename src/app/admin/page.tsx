import type { Metadata } from "next";
import AdminPageClient from "./admin-page-client";

export const metadata: Metadata = {
  title: "Admin Dashboard | MOC Request Platform",
  description: "Manage incoming requests, triage work, and keep Ministry of Culture reviews organized.",
};

export default function AdminPage() {
  return <AdminPageClient />;
}