import { NextResponse } from "next/server";
import { z } from "zod";

import { getProjects } from "@/lib/data";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const projectSchema = z.object({
  slug: z.string().min(3),
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  technologies: z.array(z.string()).min(1),
  hero: z.string().min(10),
  metrics: z.array(z.string()).min(1),
  challenge: z.string().min(10),
  solution: z.string().min(10),
  outcome: z.string().min(10)
});

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getProjects();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = projectSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid project payload." }, { status: 400 });
  }

  try {
    const item = await prisma.project.create({
      data: parsed.data
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ item: parsed.data });
  }
}
