import type { ReactNode } from "react";
import { AdminChrome } from "@/components/dashboard/admin-chrome";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  return <AdminChrome>{children}</AdminChrome>;
}
