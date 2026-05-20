import { NextResponse } from "next/server";
import { z } from "zod";

import { getPosts } from "@/lib/data";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const postSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(5),
  excerpt: z.string().min(10),
  category: z.string().min(2),
  publishedAt: z.string().min(8),
  readTime: z.string().min(3),
  featured: z.boolean(),
  cover: z.string().min(2),
  content: z.string().min(20)
});

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getPosts();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = postSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post payload." }, { status: 400 });
  }

  try {
    const item = await prisma.post.create({
      data: {
        ...parsed.data,
        publishedAt: new Date(parsed.data.publishedAt)
      }
    });

    return NextResponse.json({
      item: {
        ...item,
        publishedAt: item.publishedAt.toISOString().slice(0, 10)
      }
    });
  } catch {
    return NextResponse.json({ item: parsed.data });
  }
}
