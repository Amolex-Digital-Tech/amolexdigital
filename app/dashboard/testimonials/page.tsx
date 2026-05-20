import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { getTestimonials } from "@/lib/data";
import { requireAdminSession } from "@/lib/auth";

export default async function DashboardTestimonialsPage() {
  await requireAdminSession();

  const testimonials = await getTestimonials();

  return (
    <DashboardShell
      title="Testimonial management"
      description="Manage credibility assets and client proof used throughout the public site."
    >
      <ResourceManager
        title="testimonials"
        description="Capture client quotes and attribution."
        endpoint="/api/testimonials"
        initialItems={testimonials}
        fields={[
          { name: "name", label: "Name", placeholder: "Client name" },
          { name: "company", label: "Company", placeholder: "Company name" },
          { name: "quote", label: "Quote", type: "textarea", placeholder: "Client feedback" }
        ]}
      />
    </DashboardShell>
  );
}
