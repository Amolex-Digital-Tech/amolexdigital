import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, FileText, FolderKanban, LayoutDashboard, Quote, Users } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Card } from "@/components/ui/card";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/posts", label: "Blog posts", icon: FileText },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: Quote }
];

export function DashboardShell({
  children,
  title,
  description
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="container py-12">
      <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
        <Card className="h-fit p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <Logo />
              <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Admin workspace</p>
                <p className="mt-2 text-xl font-semibold">Content + operations</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Manage portfolio, publishing, people, and credibility assets from one control layer.
                </p>
              </div>
            </div>
            <nav className="grid gap-2">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm text-muted-foreground transition hover:border-border hover:bg-background/70 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amolex-gradient text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Performance-ready</p>
                  <p className="text-sm text-muted-foreground">Next.js, Prisma, and Vercel-oriented architecture.</p>
                </div>
              </div>
            </div>
            <SignOutButton redirectTo="/dashboard/admin/sign-in" />
          </div>
        </Card>
        <div className="space-y-6">
          <div className="section-shell">
            <p className="text-sm uppercase tracking-[0.24em] text-secondary">Dashboard</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
