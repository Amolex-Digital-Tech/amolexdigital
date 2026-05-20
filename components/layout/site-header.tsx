"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-5 inset-x-0 z-50 [font-family:var(--font-nexa)]">
      
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="h-32 w-[70%] rounded-full bg-gradient-to-r from-[#C8A96B]/20 via-[#FDF6EC]/10 to-[#1F4D3A]/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        
        {/* Floating Navbar */}
        <div className="relative flex h-24 items-center justify-between rounded-full border border-white/20 bg-[#FDF6EC]/55 px-6 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          
          {/* Logo */}
          <div className="scale-90">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-3 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 border",

                  pathname === link.href
                    ? "bg-[#1F4D3A] text-[#FDF6EC] border-[#1F4D3A] shadow-[0_10px_30px_rgba(31,77,58,0.25)]"

                    : "bg-transparent text-[#1F4D3A]/70 border-transparent hover:bg-white/40 hover:text-[#1F4D3A] hover:border-white/30 hover:shadow-[0_8px_20px_rgba(255,255,255,0.08)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden items-center gap-4 lg:flex">

            {/* Luxury Divider */}
            <div className="h-8 w-px bg-[#C8A96B]/30" />

            {/* Start Project Button */}
            <Button
              asChild
              className="rounded-full border border-[#1F4D3A]/10 bg-[#1F4D3A] px-7 py-6 text-sm font-semibold tracking-wide text-[#FDF6EC] shadow-[0_12px_30px_rgba(31,77,58,0.25)] transition-all duration-300 hover:scale-105 hover:bg-[#163829] hover:shadow-[0_18px_40px_rgba(31,77,58,0.35)]"
            >
              <Link href="/contact">
                Start Project
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <MobileNav links={links} />
          </div>
        </div>
      </div>
    </header>
  );
}