"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MoreVertical,
  Search,
  Settings,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Users as UsersIcon,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin", badge: undefined },
  { icon: ClipboardList, label: "Leads", href: "/dashboard/admin/leads", badge: 12 },
  { icon: Users, label: "Clients", href: "/dashboard/admin/client", badge: 3 },
  { icon: ClipboardList, label: "Tasks", href: "/dashboard/admin/tasks", badge: 8 },
  { icon: MessageSquare, label: "Team Talk", href: "/dashboard/admin/reports", badge: undefined },
  { icon: Users, label: "Team", href: "/dashboard/admin/team", badge: undefined },
  { icon: Settings, label: "Settings", href: "/dashboard/admin/settings", badge: undefined },
];

const navSections = [
  { title: "Main", items: navItems.slice(0, 4) },
  { title: "Workspace", items: navItems.slice(4) },
];

const priorityAlerts = [
  {
    id: 1,
    title: "Overdue Tasks",
    count: 5,
    icon: AlertCircle,
    color: "#2563eb",
    bgColor: "rgba(37, 99, 235, 0.12)",
    trend: "+2 from yesterday",
    trendUp: false,
  },
  {
    id: 2,
    title: "Leads Requiring Follow-up",
    count: 12,
    icon: Target,
    color: "#2563eb",
    bgColor: "rgba(37, 99, 235, 0.14)",
    trend: "+5 this week",
    trendUp: true,
  },
  {
    id: 3,
    title: "Clients Awaiting Reply",
    count: 3,
    icon: MessageSquare,
    color: "#0ea5e9",
    bgColor: "rgba(14, 165, 233, 0.14)",
    trend: "-1 from last week",
    trendUp: false,
  },
];

const kpiData = [
  {
    id: 1,
    title: "Total Leads",
    value: "2,847",
    change: "+12.5%",
    changeUp: true,
    chartData: [400, 300, 500, 450, 600, 550, 700, 650, 800, 750, 850, 900],
    color: "#2563eb",
  },
  {
    id: 2,
    title: "Active Clients",
    value: "156",
    change: "+8.2%",
    changeUp: true,
    chartData: [200, 180, 220, 210, 240, 230, 260, 250, 280, 270, 290, 300],
    color: "#60a5fa",
  },
  {
    id: 3,
    title: "Tasks Due Today",
    value: "23",
    change: "-3 from yesterday",
    changeUp: false,
    chartData: [30, 25, 28, 22, 26, 24, 28, 25, 23, 22, 24, 23],
    color: "#1d4ed8",
  },
  {
    id: 4,
    title: "Conversion Rate",
    value: "24.8%",
    change: "+2.3%",
    changeUp: true,
    chartData: [15, 18, 16, 20, 19, 22, 21, 23, 22, 24, 23, 24.8],
    color: "#3b82f6",
  },
];

const scheduleData = [
  {
    id: 1,
    time: "09:00",
    title: "Weekly Team Standup",
    type: "meeting",
    attendees: ["Sarah Chen", "Mike Johnson", "Alex Rivera"],
    status: "confirmed",
  },
  {
    id: 2,
    time: "10:30",
    title: "Client Review - TechCorp",
    type: "meeting",
    attendees: ["Client: David Kim"],
    status: "confirmed",
  },
  {
    id: 3,
    time: "12:00",
    title: "Q3 Strategy Follow-up",
    type: "deadline",
    attendees: [],
    status: "pending",
  },
  {
    id: 4,
    time: "14:00",
    title: "New Lead Call - InnovateX",
    type: "call",
    attendees: ["Lead: Jennifer Walsh"],
    status: "scheduled",
  },
  {
    id: 5,
    time: "16:00",
    title: "Project Alpha Delivery",
    type: "deadline",
    attendees: [],
    status: "urgent",
  },
];

const activityFeed = [
  {
    id: 1,
    user: "Sarah Chen",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    action: "completed task",
    target: "Website Redesign Mockups",
    time: "5 minutes ago",
    type: "task",
  },
  {
    id: 2,
    user: "Mike Johnson",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    action: "added new lead",
    target: "TechStart Inc.",
    time: "12 minutes ago",
    type: "lead",
  },
  {
    id: 3,
    user: "Alex Rivera",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    action: "generated report",
    target: "Q3 Performance Analysis",
    time: "28 minutes ago",
    type: "report",
  },
  {
    id: 4,
    user: "Emma Wilson",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    action: "completed follow-up",
    target: "Enterprise Client Call",
    time: "1 hour ago",
    type: "followup",
  },
  {
    id: 5,
    user: "David Park",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    action: "updated client status",
    target: "GlobalTech Solutions",
    time: "2 hours ago",
    type: "client",
  },
  {
    id: 6,
    user: "Lisa Anderson",
    userAvatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    action: "created new task",
    target: "Content Calendar Planning",
    time: "3 hours ago",
    type: "task",
  },
];

const statusBadgeStyles: Record<string, string> = {
  urgent: "border-blue-200 bg-blue-50 text-blue-700",
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  pending: "border-sky-200 bg-sky-50 text-sky-700",
  scheduled: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

type PortalSessionUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  position?: string | null;
  photoUrl?: string | null;
};

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const sessionUser = session?.user as PortalSessionUser | undefined;
  const isAdmin = sessionUser?.role === "admin";
  const displayName = sessionUser?.name?.trim() || "Admin User";
  const displayEmail = sessionUser?.email?.trim() || "admin@amolex.tech";
  const displayRole = sessionUser?.position?.trim() || (isAdmin ? "Operations Manager" : "Employee");
  const profilePhoto = sessionUser?.photoUrl ?? null;
  const profileInitials = (displayName || displayEmail)
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f4f8ff] via-[#eef5ff] to-[#f8fbff] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(37,99,235,0.07),transparent_55%),radial-gradient(ellipse_at_80%_10%,rgba(96,165,250,0.09),transparent_35%)]" />

      <motion.aside
        initial={{ x: -64, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-blue-100 bg-white pb-5 pt-6 text-slate-900 shadow-[0_20px_45px_rgba(37,99,235,0.08)]",
          "transition-transform duration-300 lg:translate-x-0",
          sidebarCollapsed ? "w-20 px-3" : "w-72 px-5",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className={cn("relative mb-5", sidebarCollapsed ? "px-1" : "px-0")}>
          <div className={cn("grid items-center gap-3", sidebarCollapsed ? "grid-cols-1 justify-items-center" : "grid-cols-[72px_1fr]")}>
            <div className="flex items-center justify-center">
              <Image
                src="/amolex-portal-logo.png"
                alt="Amolex Portal logo"
                width={sidebarCollapsed ? 48 : 72}
                height={sidebarCollapsed ? 48 : 72}
                className={cn(
                  "object-contain",
                  sidebarCollapsed
                    ? "h-10 w-10"
                    : "h-10 w-10 drop-shadow-[0_6px_14px_rgba(0,0,0,0.12)]"
                )}
                priority
              />
            </div>

            {!sidebarCollapsed && (
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
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="h-8 w-8 border border-blue-200 bg-white text-slate-800 hover:bg-blue-100 hover:text-blue-700"
            aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <div className="h-px flex-1 bg-blue-100" />
          </div>

          <div className="space-y-3">
            {navSections.map((section, sectionIndex) => (
              <div key={section.title} className={cn(sectionIndex > 0 && "pt-2")}>
                {!sidebarCollapsed && (
                  <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                    {section.title}
                  </p>
                )}

                <div className="space-y-2">
                  {section.items.map((item) => {
                    const active = item.label === "Dashboard";
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.16 }}
                        className={cn(
                          "flex items-center border px-3 py-2 text-left transition",
                          sidebarCollapsed ? "justify-center gap-0" : "gap-3",
                          active
                            ? "border-blue-300 bg-blue-100 text-blue-900"
                            : "border-transparent text-slate-800 hover:border-blue-200 hover:bg-blue-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                        {!sidebarCollapsed && item.badge ? (
                          <span className="ml-auto text-xs font-semibold text-blue-700">{item.badge}</span>
                        ) : null}
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="mt-auto pt-5">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-16 w-16 border-2 border-blue-200 shadow-lg">
              <AvatarImage src={profilePhoto ?? undefined} />
              <AvatarFallback>{profileInitials}</AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <>
                <p className="mt-2 text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-800">{displayRole}</p>
                <p className="text-xs text-slate-700">{displayEmail}</p>
              </>
            )}
          </div>
        </div>
      </motion.aside>

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-blue-600/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn("relative z-10 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-72")}>
        <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="border border-blue-200 bg-white text-slate-800 hover:bg-blue-100 hover:text-blue-700 lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-blue-500">Amolex Digital</p>
                <h1 className="text-2xl font-semibold leading-tight text-slate-900">Operations Center</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />
                <Input
                  placeholder="Search leads, clients, tasks..."
                  className="w-80 border-blue-200 bg-blue-50/80 pl-10 text-slate-900 placeholder:text-slate-700"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="relative border border-blue-200 bg-white text-slate-800 hover:bg-blue-100 hover:text-blue-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="sr-only">Notifications</span>
              </Button>

              <div className="hidden items-center gap-2 rounded-none border border-blue-200 bg-white px-2 py-1.5 sm:flex">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profilePhoto ?? undefined} />
                  <AvatarFallback>{profileInitials}</AvatarFallback>
                </Avatar>
                <div className="pr-1 text-right">
                  <p className="text-xs font-semibold text-slate-800">Welcome back, {displayName}</p>
                  <p className="text-[11px] text-slate-800">{displayRole}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Priority Alerts</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {priorityAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 + 0.1 }}
                  whileHover={{ y: -3 }}
                  className="relative overflow-hidden rounded-none border border-blue-200 p-5 shadow-[0_12px_30px_rgba(37,99,235,0.08)]"
                  style={{
                    background: "linear-gradient(120deg, rgba(255,255,255,0.96), rgba(248,251,255,0.96))",
                  }}
                >
                  <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-blue-200 blur-xl" />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-none" style={{ backgroundColor: alert.bgColor }}>
                        <alert.icon className="h-5 w-5" style={{ color: alert.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                        <p className="text-3xl font-semibold leading-none" style={{ color: alert.color }}>
                          {alert.count}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs">
                    {alert.trendUp ? (
                      <ArrowUpRight className="h-4 w-4 text-blue-700" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-slate-800" />
                    )}
                    <span className="text-slate-900">{alert.trend}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {isAdmin ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
              className="mb-6"
            >
              <Card className="overflow-hidden border-blue-200 bg-white shadow-[0_14px_32px_rgba(37,99,235,0.08)]">
                <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                      Employee Access
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900">Register and manage logins</h2>
                    <p className="max-w-2xl text-sm leading-7 text-slate-800">
                      Add employees here so they can sign in with their own email and password at the admin login page.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/admin/employees"
                    className="inline-flex items-center justify-center rounded-none bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Open employee manager
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : !profilePhoto ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
              className="mb-6"
            >
              <Card className="overflow-hidden border-amber-300 bg-amber-50 shadow-[0_14px_32px_rgba(217,119,6,0.08)]">
                <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
                      Profile setup
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900">Add your profile photo</h2>
                    <p className="max-w-2xl text-sm leading-7 text-slate-800">
                      Upload a photo in Settings so your picture appears across the portal and employee cards.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/admin/settings?onboarding=photo"
                    className="inline-flex items-center justify-center rounded-none bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Open settings
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mb-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpiData.map((kpi, index) => (
                <motion.div
                  key={kpi.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 + 0.2 }}
                >
                  <Card className="h-full rounded-none border-blue-200 bg-white text-slate-900 shadow-[0_14px_32px_rgba(37,99,235,0.08)]">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-900">{kpi.title}</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-none bg-blue-100">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 text-3xl font-semibold leading-none text-slate-900">{kpi.value}</p>
                      <div className="mb-3 flex items-center gap-1 text-xs">
                        {kpi.changeUp ? (
                          <ArrowUpRight className="h-4 w-4 text-blue-700" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-slate-800" />
                        )}
                        <span className="text-slate-900">{kpi.change}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="xl:col-span-2"
            >
              <Card className="h-full rounded-none border-blue-200 bg-white text-slate-900 shadow-[0_12px_30px_rgba(37,99,235,0.08)]">
                <CardHeader className="border-b border-blue-200 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      Today&apos;s Schedule
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100 hover:text-blue-900 font-semibold">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {scheduleData.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.07 + 0.4 }}
                      className="flex items-start gap-3 rounded-none border border-blue-200 bg-blue-50/60 p-3"
                    >
                      <div className="min-w-[58px] rounded-none border border-blue-200 bg-white px-2 py-1 text-center text-xs font-semibold text-slate-800">
                        {item.time}
                      </div>

                      <div className="flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                          {(item.status === "urgent" || item.status === "confirmed") && (
                            <Badge className={cn("border font-semibold", statusBadgeStyles[item.status])}>
                              {item.status === "urgent" ? "Urgent" : "Confirmed"}
                            </Badge>
                          )}
                        </div>

                        {item.attendees.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-slate-800">
                            <div className="flex -space-x-2">
                              {item.attendees.slice(0, 3).map((attendee, attendeeIndex) => (
                                <Avatar key={attendeeIndex} className="h-6 w-6 border border-[#efe4d1]">
                                  <AvatarFallback className="bg-blue-100 text-[10px] text-slate-900 font-semibold">
                                    {attendee
                                      .split(" ")
                                      .map((part) => part[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-slate-800">{item.attendees.join(", ")}</span>
                          </div>
                        )}
                      </div>

                      <ChevronRight className="mt-1 h-4 w-4 text-slate-700" />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.45 }}
            >
              <Card className="h-full rounded-none border-blue-200 bg-white text-slate-900 shadow-[0_12px_30px_rgba(37,99,235,0.08)]">
                <CardHeader className="border-b border-blue-200 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button className="h-auto w-full justify-start gap-3 rounded-none border-0 bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-white shadow-md hover:from-blue-700 hover:to-blue-600 hover:shadow-lg">
                    <UserPlus className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Add Lead</div>
                      <div className="text-xs text-white">Create new lead entry</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="h-auto w-full justify-start gap-3 rounded-none border-blue-200 bg-white py-3 text-slate-800 hover:bg-blue-50 font-medium">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold">Add Client</div>
                      <div className="text-xs text-slate-800">Register new client</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="h-auto w-full justify-start gap-3 rounded-none border-blue-200 bg-white py-3 text-slate-800 hover:bg-blue-50 font-medium">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold">Assign Task</div>
                      <div className="text-xs text-slate-800">Create team task</div>
                    </div>
                  </Button>

                  <Button asChild variant="outline" className="h-auto w-full justify-start gap-3 rounded-none border-blue-200 bg-white py-3 text-slate-800 hover:bg-blue-50 font-medium">
                    <Link href="/dashboard/admin/reports">
                      <MessageSquare className="h-5 w-5 text-sky-600" />
                      <div className="text-left">
                        <div className="font-semibold">Open Team Talk</div>
                        <div className="text-xs text-slate-800">Chat with the team</div>
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
              <Card className="rounded-none border-blue-200 bg-white text-slate-900 shadow-[0_12px_30px_rgba(37,99,235,0.08)]">
              <CardHeader className="border-b border-blue-200 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Team Activity Feed
                  </CardTitle>
                  <Badge className="border-blue-300 bg-blue-100 text-blue-800 font-semibold">Live</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {activityFeed.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.07 + 0.65 }}
                    className="group flex items-start gap-3 rounded-none border border-blue-200 bg-blue-50/60 p-3"
                  >
                    <Avatar className="h-10 w-10 border border-blue-200">
                      <AvatarImage src={activity.userAvatar} />
                      <AvatarFallback className="bg-blue-100 text-slate-900 font-semibold">
                        {activity.user
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="text-sm text-slate-900">
                        <span className="font-semibold text-slate-900">{activity.user}</span> {activity.action}{" "}
                        <span className="font-semibold text-slate-900">{activity.target}</span>
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        <span>{activity.time}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-100 text-slate-800 hover:bg-blue-100 hover:text-slate-800"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
