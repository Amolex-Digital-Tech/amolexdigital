import type { MetadataRoute } from "next";

import { getPosts, getProjects } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  const staticRoutes = ["", "/about", "/services", "/portfolio", "/blog", "/careers", "/contact"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date()
    })),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/portfolio/${project.slug}`,
      lastModified: new Date()
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt)
    }))
  ];
}
