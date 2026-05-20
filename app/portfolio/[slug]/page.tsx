import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/site";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return buildMetadata({ title: "Project not found | Amolex Digital Tech" });
  }

  return buildMetadata({
    title: `${project.name} | Amolex Digital Tech`,
    description: project.description,
    path: `/portfolio/${project.slug}`
  });
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-20 space-y-10">
      <div className="section-shell space-y-6">
        <Badge>{project.category}</Badge>
        <h1 className="font-heading text-5xl font-semibold text-balance">{project.name}</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{project.hero}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {project.metrics.map((metric) => (
          <Card key={metric} className="p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Outcome</p>
            <p className="mt-3 text-2xl font-semibold">{metric}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          ["Challenge", project.challenge],
          ["Solution", project.solution],
          ["Outcome", project.outcome]
        ].map(([title, copy]) => (
          <Card key={title} className="p-6">
            <h2 className="font-heading text-2xl font-semibold">{title}</h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">{copy}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
