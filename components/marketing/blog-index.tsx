"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Post } from "@/lib/data";

export function BlogIndex({ posts }: { posts: Post[] }) {
  const categories = ["All", ...Array.from(new Set(posts.map((post) => post.category)))];
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const haystack = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-10">
      <div className="section-shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.28em] text-secondary">Blog CMS</p>
          <h1 className="font-heading text-4xl font-semibold text-balance sm:text-5xl">Ideas, systems, and execution details.</h1>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground">
            Search articles by category, browse featured thinking, and publish markdown-backed content through the Amolex
            content model.
          </p>
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles, topics, or keywords"
          className="max-w-md"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeCategory === category
                ? "border-secondary bg-secondary/10 text-primary dark:text-secondary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredPosts.map((post) => (
          <Card key={post.slug} className="h-full droplet-card">
            <CardHeader>
              <Badge>{post.category}</Badge>
              <CardTitle className="pt-5 text-2xl">{post.title}</CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
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
  );
}
