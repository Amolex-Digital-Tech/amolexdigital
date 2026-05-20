"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SupportBot } from "@/components/ui/support-bot";
import { LeadFunnel } from "@/components/ui/lead-funnel";

export function ConditionalChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <main>{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <SupportBot />
      <LeadFunnel />
    </>
  );
}
