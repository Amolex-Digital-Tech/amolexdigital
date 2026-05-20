import { Layers3, PenTool, ServerCog, Smartphone, Sparkles, WandSparkles } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/data";

const icons = [Layers3, Smartphone, Sparkles, ServerCog, PenTool, WandSparkles];

export function ServicesGrid() {
  return (
    <section className="py-24">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="Services"
          title="Specialized product and platform delivery for ambitious teams."
          description="We combine engineering, product design, AI implementation, and infrastructure strategy into one execution system."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index];

            return (
              <Card key={service.title} className="group droplet-card transition duration-300 hover:-translate-y-1 hover:border-secondary/40">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amolex-gradient text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="pt-6">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {service.points.map((point) => (
                    <div key={point} className="rounded-2xl border border-white/20 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm">
                      {point}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
