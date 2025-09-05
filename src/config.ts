// Central app configuration and boilerplate variables
// In a real app, prefer using process.env.NEXT_PUBLIC_* for client-side values
// Here we provide sensible defaults with env fallbacks for the demo

export const CONFIG = {
  // LocalStorage keys
  storage: {
    requests: "moc_requests_v1",
    authFlag: "moc_admin_authed",
    equipment: "moc_equipment_v1",
  },
  // Demo-only admin password. Override via NEXT_PUBLIC_ADMIN_PASSWORD
  demo: {
    adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin",
  },
} as const;
