"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BarChart, FileText, Link2, Share2, Users, Settings } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Card } from "@/components/ui/card";
import { useCompanyName } from "./company-context";

const clientLinks = [
  { href: "/dashboard/client", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/client/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/client/calendar", label: "Marketing Calendar", icon: BarChart },
  { href: "/dashboard/client/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/client/social", label: "Social Accounts", icon: Link2 },
  { href: "/dashboard/client/posts", label: "Posts", icon: Share2 },
  { href: "/dashboard/client/settings", label: "Settings", icon: Settings }
];

export function ClientDashboardShell({
  children,
  title,
  description,
  hideHeader = false
}: {
  children: ReactNode;
  title: string;
  description: string;
  hideHeader?: boolean;
}) {
  const companyName = useCompanyName();
  const pathname = usePathname();
  const [clientLogo, setClientLogo] = useState<string | null>(null);

  useEffect(() => {
    const key = `client_logo_${companyName.toLowerCase().replace(/\s/g, "_")}`;
    const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    setClientLogo(stored);
  }, [companyName]);

  return (
    <div className="container py-8">
      {/* Client Portal Header */}
      <header className="relative mb-6 overflow-hidden rounded-[24px] border border-white/60 bg-gradient-to-r from-[#f8fafc]/80 via-white/70 to-white/80 px-4 py-4 shadow-[0_14px_50px_rgba(15,23,42,0.14)] backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(22,163,74,0.10),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(37,99,235,0.08),transparent_30%)]" />
        <div className="relative flex flex-wrap items-center gap-4">
          {/* Left: logo + label */}
          <div className="flex items-center gap-3 pr-3">
            <Logo />
            <span className="text-sm font-semibold text-[#475569]">Client Dashboard</span>
          </div>

          {/* Center: nav pills */}
          <nav className="relative flex-1 overflow-x-auto">
            <div className="flex items-center justify-center gap-2 min-w-max">
              {clientLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                      active
                        ? "bg-white text-[#0F172A] shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-1 ring-white/70"
                        : "text-[#475569] hover:bg-white/60 hover:text-[#0F172A] border border-white/40"
                    }`}
                  >
                    {link.label === "Settings" && clientLogo ? (
                      <span className="flex h-7 w-16 items-center justify-center overflow-hidden rounded-full bg-white">
                        <img src={clientLogo} alt="Client logo" className="h-full w-full object-contain" />
                      </span>
                    ) : (
                      link.label
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

        </div>
      </header>

      <div className="flex flex-col gap-6">
        {!hideHeader && (
          <div className="section-shell">
            <p className="text-sm uppercase tracking-[0.24em] text-secondary">Dashboard</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{description}</p>
          </div>
        )}
        {children}
      </div>

      {/* Client Portal Footer */}
      <footer className="mt-10 rounded-2xl border border-[#e4ebdf] bg-white/90 px-4 py-4 text-center text-sm text-muted-foreground shadow-[0_6px_18px_rgba(16,61,46,0.06)] backdrop-blur-md">
        © 2026 Amolex. All rights reserved.
      </footer>
    </div>
  );
}
