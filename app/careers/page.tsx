import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { jobs } from "@/lib/data";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Careers | Amolex Digital Tech",
  path: "/careers"
});

export default function CareersPage() {
  return (
    <div className="container py-20 space-y-12">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Careers"
          title="Join a team building premium digital products and applied AI systems."
          description="We hire for clear thinking, high standards, and execution strength across product, design, AI, and engineering."
        />
      </div>
      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.title} className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold">{job.title}</h2>
                <p className="mt-2 text-sm text-secondary">
                  {job.location} · {job.type}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{job.summary}</p>
              </div>
              <Button asChild>
                <a href="mailto:careers@amolex.tech?subject=Application">Apply now</a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
