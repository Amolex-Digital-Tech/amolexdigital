import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";

import { Providers } from "@/components/providers";
import { LiquidBackground } from "@/components/ui/liquid-background";
import { buildMetadata, siteConfig } from "@/lib/site";
import { ConditionalChrome } from "@/components/layout/conditional-chrome";

import "./globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${siteConfig.name} | Digital Innovation Platform`
  })
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  // Check if we're on a dashboard page
  const headersList = headers();
  const rawPath =
    headersList.get("x-current-path") ||
    headersList.get("next-url") ||
    "";
  const pathname = rawPath.startsWith("http")
    ? (() => {
        try {
          return new URL(rawPath).pathname;
        } catch {
          return rawPath;
        }
      })()
    : rawPath;
  const isDashboardPage = pathname.startsWith("/dashboard") || pathname.includes("/dashboard/");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_top,rgba(16,61,46,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(178,146,103,0.16),transparent_24%)]" />
            <LiquidBackground />
            <ConditionalChrome>{children}</ConditionalChrome>
          </div>
        </Providers>
      </body>
    </html>
  );
}
