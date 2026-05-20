import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { getPosts } from "@/lib/data";
import { requireAdminSession } from "@/lib/auth";

export default async function DashboardPostsPage() {
  await requireAdminSession();

  const posts = await getPosts();

  return (
    <DashboardShell
      title="Blog CMS"
      description="Publish markdown-ready articles, set featured status, and organize posts by category."
    >
      <ResourceManager
        title="posts"
        description="Create and manage articles for the Amolex technology publication."
        endpoint="/api/posts"
        initialItems={posts}
        fields={[
          { name: "slug", label: "Slug", placeholder: "post-slug" },
          { name: "title", label: "Title", placeholder: "Article title" },
          { name: "excerpt", label: "Excerpt", type: "textarea", placeholder: "Summary" },
          { name: "category", label: "Category", placeholder: "Software Engineering" },
          { name: "publishedAt", label: "Publish date", type: "date" },
          { name: "readTime", label: "Read time", placeholder: "5 min read" },
          { name: "cover", label: "Cover label", placeholder: "AI systems" },
          { name: "featured", label: "Featured article", type: "checkbox" },
          { name: "content", label: "Markdown content", type: "textarea", placeholder: "## Heading" }
        ]}
      />
    </DashboardShell>
  );
}
