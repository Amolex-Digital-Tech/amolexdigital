"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  Users,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
  { icon: ClipboardList, label: "Leads", href: "/dashboard/admin/leads" },
  { icon: CalendarDays, label: "Calendar", href: "/dashboard/admin/calendar" },
  { icon: Users, label: "Clients", href: "/dashboard/admin/client" },
  { icon: ClipboardList, label: "Tasks", href: "/dashboard/admin/tasks" },
  { icon: MessageSquare, label: "Team Talk", href: "/dashboard/admin/reports" },
  { icon: Users, label: "Team", href: "/dashboard/admin/team" },
  { icon: UserPlus, label: "Employees", href: "/dashboard/admin/employees" },
  { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" },
];

type PortalSessionUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  position?: string | null;
  photoUrl?: string | null;
};

export function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const compactRoute = pathname.includes("/dashboard/admin/leads");
  const sessionUser = session?.user as PortalSessionUser | undefined;
  const isAdmin = sessionUser?.role === "admin";
  const adminName = sessionUser?.name?.trim() || "Admin User";
  const adminEmail = sessionUser?.email?.trim() || "admin@amolex.tech";
  const adminRole = sessionUser?.position?.trim() || (isAdmin ? "System admin" : "Authorized employee");
  const adminPhoto = sessionUser?.photoUrl ?? null;
  const initials = (adminName || adminEmail)
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";
  const visibleNavItems = isAdmin ? navItems : navItems.filter((item) => item.label !== "Employees");

  if (!pathname.startsWith("/dashboard/admin") || pathname === "/dashboard/admin/sign-in" || pathname === "/dashboard/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f8ff] via-[#eef5ff] to-[#f8fbff] text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-blue-100 bg-white pb-5 pt-6 text-slate-900 shadow-[0_20px_45px_rgba(37,99,235,0.08)]",
            "transition-all duration-300 lg:translate-x-0",
            collapsed ? "w-20 px-3" : "w-72 px-5",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className={cn("relative mb-5", collapsed ? "px-1" : "px-0")}>
            <div className={cn("grid items-center gap-3", collapsed ? "grid-cols-1 justify-items-center" : "grid-cols-[72px_1fr]")}>
              <div className="flex items-center justify-center">
                <Image
                  src="/amolex-portal-logo.png"
                  alt="Amolex Portal logo"
                  width={collapsed ? 48 : 72}
                  height={collapsed ? 48 : 72}
                  className={cn("object-contain", collapsed ? "h-10 w-10" : "h-10 w-10 drop-shadow-[0_6px_14px_rgba(0,0,0,0.12)]")}
                  priority
                />
              </div>

              {!collapsed && (
                <div className="min-w-0 space-y-0.5 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">Amolex Portal</p>
                  <p className="text-base font-semibold leading-tight text-slate-900">Operation Center</p>
                </div>
              )}
            </div>
          </div>

          <nav className="relative mt-1">
            <div className="mb-3 flex items-center gap-2 px-2">
              <div className="h-px flex-1 bg-blue-100" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed((prev) => !prev)}
                className="h-8 w-8 border border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
                aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <div className="h-px flex-1 bg-blue-100" />
            </div>

            <div className="space-y-2">
              {visibleNavItems.map((item) => {
                const active =
                  item.href === "/dashboard/admin"
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center border px-3 py-2 text-left transition",
                      collapsed ? "justify-center gap-0" : "gap-3",
                      active
                        ? "border-blue-200 bg-blue-50 text-blue-800 shadow-[inset_3px_0_0_rgba(37,99,235,1)]"
                        : "border-transparent text-slate-700 hover:border-blue-100 hover:bg-blue-50"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 rounded-r-full bg-blue-600 transition-opacity",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Icon className={cn("h-4 w-4 transition-colors", active ? "text-blue-700" : "text-slate-500")} />
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    <span className={cn("ml-auto h-2.5 w-2.5 rounded-full border border-transparent transition-all", active ? "bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" : "bg-transparent")} />
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto pt-5">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 shadow-sm">
              <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "justify-start")}>
                <Avatar className="h-14 w-14 rounded-2xl border border-blue-100 bg-white shadow-sm">
                  <AvatarImage src={adminPhoto ?? undefined} />
                  <AvatarFallback className="rounded-2xl text-sm font-semibold text-blue-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{adminName}</p>
                    <p className="truncate text-xs text-slate-500">{adminRole}</p>
                    <p className="truncate text-xs text-slate-400">{adminEmail}</p>
                  </div>
                )}
              </div>

              {!collapsed && (
                <div className="mt-4">
                  {!adminPhoto && !isAdmin ? (
                    <Button asChild variant="outline" size="sm" className="mb-3 w-full justify-center border-blue-100 bg-white text-slate-700 hover:bg-blue-50">
                      <Link href="/dashboard/admin/settings?onboarding=photo">Add your photo</Link>
                    </Button>
                  ) : null}
                  <SignOutButton
                    redirectTo="/dashboard/admin/sign-in"
                    variant="outline"
                    size="sm"
                    className="w-full justify-center border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
                  />
                </div>
              )}

              {collapsed && (
                <div className="mt-3 flex justify-center">
                  <SignOutButton
                    redirectTo="/dashboard/admin/sign-in"
                    variant="outline"
                    size="icon"
                    showLabel={false}
                    className="border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
                  />
                </div>
              )}
            </div>
          </div>
        </aside>

        {mobileOpen && (
          <button
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className={cn("flex w-full flex-col transition-all duration-300", collapsed ? "lg:pl-20" : "lg:pl-72")}>
          {!compactRoute && (
            <header className={cn("fixed left-0 right-0 top-0 z-30 border-b border-blue-100 bg-white/95 px-4 py-3 backdrop-blur-md", collapsed ? "lg:left-20" : "lg:left-72")}>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="border border-blue-100 bg-white text-slate-700 hover:bg-blue-50 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="min-w-0" />
              </div>
            </header>
          )}

          <main className={cn("px-4 pb-24 lg:px-6", compactRoute ? "pt-4" : "pt-24")}>{children}</main>
        </div>
      </div>
    </div>
  );
}
