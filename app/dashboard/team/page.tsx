import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { getTeamMembers } from "@/lib/data";
import { requireAdminSession } from "@/lib/auth";

export default async function DashboardTeamPage() {
  await requireAdminSession();

  const teamMembers = await getTeamMembers();

  return (
    <DashboardShell
      title="Team management"
      description="Maintain leadership, delivery, and specialist profiles used across the marketing site."
    >
      <ResourceManager
        title="team"
        description="Create and update team member entries."
        endpoint="/api/team"
        initialItems={teamMembers}
        fields={[
          { name: "name", label: "Name", placeholder: "Full name" },
          { name: "role", label: "Role", placeholder: "Head of Engineering" },
          { name: "focus", label: "Focus", type: "textarea", placeholder: "Area of responsibility" }
        ]}
      />
    </DashboardShell>
  );
}
