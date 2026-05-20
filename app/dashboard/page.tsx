import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPosts, getProjects, getTeamMembers, getTestimonials } from "@/lib/data";
import { requireAdminSession } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAdminSession();

  const [projects, posts, teamMembers, testimonials] = await Promise.all([
    getProjects(),
    getPosts(),
    getTeamMembers(),
    getTestimonials()
  ]);

  return (
    <DashboardShell
      title="Admin overview"
      description="A modern SaaS-style dashboard for managing portfolio content, publishing, and social proof."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Projects", String(projects.length)],
          ["Blog posts", String(posts.length)],
          ["Team members", String(teamMembers.length)],
          ["Testimonials", String(testimonials.length)]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <h2 className="font-heading text-2xl font-semibold">Publishing pipeline</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {posts.slice(0, 4).map((post) => (
            <div key={post.slug} className="rounded-[1.5rem] border border-border/70 bg-background/50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{post.category}</p>
              <p className="mt-2 font-medium">{post.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
