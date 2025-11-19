import type { Metadata } from "next";
import AdminPageShell from "./components/admin-page-shell";

export const metadata: Metadata = {
  title: "Admin Console | MOC Request Platform",
  description: "Access the MOC admin workspace to triage new requests, update statuses, and manage venues, equipment, and songs in one dashboard.",
};

export default function AdminPage() {
  return <AdminPageShell />;
}
