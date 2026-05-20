import dynamic from "next/dynamic";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HeroCanvas = dynamic(
  () => import("@/components/scene/hero-canvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

export function HomeHero() {
  return (
    <section className="relative overflow-hidden py-24 font-display sm:py-28">
      <div className="absolute inset-0 bg-[#f6faf8]" />
      <div className="absolute inset-0 bg-grid-radial" />
      <div className="container relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <Badge>Amolex Digital Tech</Badge>
          <div className="space-y-6">
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-tight text-balance sm:text-6xl lg:text-7xl">
              Designing the future of brands through {" "}
              <span className="gradient-text">technology and strategy</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Amolex Digital Tech delivers powerful digital marketing strategies and advanced technology solutions that
              help businesses grow, innovate, and succeed in the modern digital economy.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Start Your Project</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-secondary" />
              Delivering innovative digital solutions designed to help businesses scale and succeed.
            </div>
          </div>
        </div>
        <div className="relative h-[460px] overflow-hidden rounded-[2rem] border border-secondary/15 bg-[#103D2E]/90 shadow-glow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(178,146,103,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,61,46,0.28),transparent_38%)]" />
          <HeroCanvas />
        </div>
      </div>
    </section>
  );
}
