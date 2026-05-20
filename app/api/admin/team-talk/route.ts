import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { auth } from "@/lib/auth";
import { getEmployeeByEmail } from "@/lib/employee-auth";
import {
  appendTeamTalkMessages,
  createAuthorSnapshot,
  getTeamTalkMembers,
  getTeamTalkMessages,
  type TeamTalkMember,
  type TeamTalkMessage,
} from "@/lib/team-talk";
import {
  resolveMentionSnapshots,
  resolveMentionSnapshotsByIds,
} from "@/lib/team-talk-shared";

export const dynamic = "force-dynamic";

function toMemberSnapshot(member: {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  photoUrl: string | null;
  active: boolean;
  isSystem?: boolean;
}): TeamTalkMember {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    position: member.position,
    photoUrl: member.photoUrl,
    active: member.active,
    isSystem: member.isSystem
  };
}

async function getCurrentMember(session: Awaited<ReturnType<typeof auth>>): Promise<TeamTalkMember | null> {
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) {
    return null;
  }

  const employee = await getEmployeeByEmail(email);
  if (employee) {
    return toMemberSnapshot(employee);
  }

  return {
    id: email,
    name: session.user?.name?.trim() || email,
    email,
    role: session.user?.role === "admin" ? "admin" : "employee",
    position:
      session.user?.position?.trim() ||
      (session.user?.role === "admin" ? "Administrator" : "Team member"),
    photoUrl: session.user?.photoUrl ?? null,
    active: true
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [messages, members] = await Promise.all([getTeamTalkMessages(), getTeamTalkMembers()]);
    return NextResponse.json({ messages, members });
  } catch (error) {
    console.error("Error loading team talk:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const content = String(body.content ?? "").trim();
    const mentionIds = Array.isArray(body.mentionIds)
      ? (body.mentionIds as unknown[]).filter((value): value is string => typeof value === "string")
      : [];

    if (!content) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const members = await getTeamTalkMembers();
    const currentMember = await getCurrentMember(session);

    if (!currentMember) {
      return NextResponse.json({ error: "Unable to resolve your profile." }, { status: 400 });
    }

    const resolvedMentions = resolveMentionSnapshotsByIds(mentionIds, members);
    const fallbackMentions = resolveMentionSnapshots(content, members);
    const mentionMap = new Map(
      [...resolvedMentions, ...fallbackMentions].map((member) => [member.id, member])
    );
    const mentions = [...mentionMap.values()];
    const now = new Date().toISOString();

    const userMessage: TeamTalkMessage = {
      id: randomUUID(),
      content,
      createdAt: now,
      updatedAt: now,
      kind: "message",
      author: createAuthorSnapshot(currentMember, currentMember.isSystem ? "system" : "human"),
      mentions
    };

    const nextMessages = await appendTeamTalkMessages([userMessage]);

    return NextResponse.json({
      success: true,
      messages: nextMessages
    });
  } catch (error) {
    console.error("Error saving team talk message:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
