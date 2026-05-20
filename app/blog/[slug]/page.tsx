import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPostBySlug, getPosts } from "@/lib/data";
import { Markdown } from "@/lib/md";
import { buildMetadata } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return buildMetadata({ title: "Post not found | Amolex Digital Tech" });
  }

  return buildMetadata({
    title: `${post.title} | Amolex Digital Tech`,
    description: post.excerpt,
    path: `/blog/${post.slug}`
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container py-20">
      <Card className="mx-auto max-w-4xl p-8 sm:p-12">
        <Badge>{post.category}</Badge>
        <h1 className="mt-6 font-heading text-4xl font-semibold text-balance sm:text-5xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span>{post.publishedAt}</span>
          <span>{post.readTime}</span>
        </div>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
        <article className="mt-10">
          <Markdown content={post.content} />
        </article>
      </Card>
    </div>
  );
}
