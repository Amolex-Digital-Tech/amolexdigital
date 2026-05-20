import { NextResponse } from "next/server";
import { z } from "zod";

import { getTeamMembers } from "@/lib/data";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const teamSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  focus: z.string().min(10)
});

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getTeamMembers();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = teamSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid team member payload." }, { status: 400 });
  }

  try {
    const item = await prisma.teamMember.create({
      data: parsed.data
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ item: parsed.data });
  }
}
