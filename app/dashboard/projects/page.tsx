import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { getProjects } from "@/lib/data";
import { requireAdminSession } from "@/lib/auth";

export default async function DashboardProjectsPage() {
  await requireAdminSession();

  const projects = await getProjects();

  return (
    <DashboardShell
      title="Project management"
      description="Create and manage portfolio entries, case study positioning, technologies, and business outcomes."
    >
      <ResourceManager
        title="projects"
        description="Add new portfolio projects for the public case study library."
        endpoint="/api/projects"
        initialItems={projects}
        fields={[
          { name: "slug", label: "Slug", placeholder: "new-project-slug" },
          { name: "name", label: "Project name", placeholder: "Project title" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Short overview" },
          { name: "category", label: "Category", placeholder: "Artificial Intelligence" },
          { name: "technologies", label: "Technologies", type: "list", placeholder: "Next.js, Prisma, PostgreSQL" },
          { name: "metrics", label: "Metrics", type: "list", placeholder: "Revenue +20%, Speed +30%" },
          { name: "hero", label: "Hero summary", placeholder: "Command-center description" },
          { name: "challenge", label: "Challenge", type: "textarea", placeholder: "Core problem" },
          { name: "solution", label: "Solution", type: "textarea", placeholder: "What Amolex built" },
          { name: "outcome", label: "Outcome", type: "textarea", placeholder: "Business results" }
        ]}
      />
    </DashboardShell>
  );
}
