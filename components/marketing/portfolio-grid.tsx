import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/data";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="py-24">
      <div className="container space-y-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="Case studies built around measurable execution."
            description="Each product combines business clarity, technical rigor, and a market-ready experience layer."
          />
          <Button asChild variant="secondary">
            <Link href="/portfolio">View all projects</Link>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.slug} className="overflow-hidden droplet-card">
              <CardHeader className="text-white relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#103D2E]/40 via-[#103D2E]/25 to-transparent" />
                <div className="relative z-10">
                  <Badge className="border-white/20 bg-white/10 text-secondary backdrop-blur-sm">{project.category}</Badge>
                </div>
                <CardTitle className="pt-6 text-2xl">{project.name}</CardTitle>
                <CardDescription className="text-stone-200/80">{project.hero}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <p className="text-sm leading-7 text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div key={metric} className="rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                      {metric}
                    </div>
                  ))}
                </div>
                <Button asChild variant="ghost" className="px-0 text-primary">
                  <Link href={`/portfolio/${project.slug}`}>
                    Read case study <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
