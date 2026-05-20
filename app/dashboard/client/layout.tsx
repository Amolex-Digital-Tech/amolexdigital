import { ClientLayoutClient } from "@/components/dashboard/client-layout-client";

export default function ClientDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ClientLayoutClient>{children}</ClientLayoutClient>;
}