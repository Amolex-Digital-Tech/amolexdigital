"use client";

import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function MobileNav({ links }: { links: Array<{ href: string; label: string }> }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <ThemeToggle />
      <Button type="button" variant="secondary" size="icon" onClick={() => setOpen((value) => !value)}>
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      {open ? (
        <div className="absolute inset-x-4 top-20 z-50 rounded-[2rem] border border-border bg-background/95 p-6 shadow-glow backdrop-blur">
          <nav className="grid gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/contact">Start a Project</Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/dashboard/sign-in">
                <LogIn className="h-4 w-4" />
                Client Portal
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
