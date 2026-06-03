import { Role } from "@prisma/client";
import type { ReactNode } from "react";

import { AdminDashboardShell } from "@/components/dashboard/admin/layout/AdminDashboardShell";
import { requireRole } from "@/lib/auth/guards";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireRole("/dashboard/admin", [Role.ADMIN]);

  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}