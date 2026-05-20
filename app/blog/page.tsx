import { BlogIndex } from "@/components/marketing/blog-index";
import { getPosts } from "@/lib/data";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Blog | Amolex Digital Tech",
  path: "/blog"
});

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container py-20">
      <BlogIndex posts={posts} />
    </div>
  );
}
