import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/data";

export function BlogGrid({ posts, title = "Thoughtful technical writing for operators, founders, and product teams." }: { posts: Post[]; title?: string }) {
  return (
    <section className="py-24">
      <div className="container space-y-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Insights"
            title={title}
            description="Structured content for AI, platform engineering, startup execution, and product design."
          />
          <Button asChild variant="secondary">
            <Link href="/blog">Open the blog</Link>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="h-full droplet-card">
              <CardHeader>
                <Badge>{post.category}</Badge>
                <CardTitle className="pt-6">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{post.publishedAt}</span>
                  <span>{post.readTime}</span>
                </div>
                <Button asChild variant="ghost" className="px-0 text-primary">
                  <Link href={`/blog/${post.slug}`}>Read article</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
