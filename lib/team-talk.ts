import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { listEmployees, type EmployeeListItem } from "@/lib/employee-auth";
import {
  createAuthorSnapshot,
  type TeamTalkAuthor,
  type TeamTalkMember,
  type TeamTalkMessage,
  type TeamTalkMention,
} from "@/lib/team-talk-shared";

export {
  createAuthorSnapshot,
  type TeamTalkAuthor,
  type TeamTalkMember,
  type TeamTalkMessage,
  type TeamTalkMention,
} from "@/lib/team-talk-shared";

const TEAM_TALK_STORE_PATH = path.join(process.cwd(), "data", "team-talk.json");

type StoredTeamTalkState = {
  messages: TeamTalkMessage[];
  updatedAt: string;
};

function toMember(employee: EmployeeListItem): TeamTalkMember {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    position: employee.position,
    photoUrl: employee.photoUrl ?? null,
    active: employee.active,
    isSystem: employee.isSystem
  };
}

function createWelcomeMessage(): TeamTalkMessage {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    content: "Welcome to Team Talk. Post a quick update, mention teammates with @Name, and keep the thread moving.",
    createdAt: now,
    updatedAt: now,
    kind: "system",
    author: createAuthorSnapshot(
      {
        id: "team-talk-system",
        name: "Team Talk",
        email: "system@amolex.tech",
        role: "system",
        position: "Workspace notice",
        photoUrl: null,
        active: true,
        isSystem: true
      },
      "system"
    ),
    mentions: []
  };
}

function normalizeMessage(message: TeamTalkMessage): TeamTalkMessage | null {
  if (message.kind !== "message" && message.kind !== "system") {
    return null;
  }

  return message;
}

async function loadState(): Promise<StoredTeamTalkState> {
  try {
    const raw = await readFile(TEAM_TALK_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoredTeamTalkState>;
    const messages = Array.isArray(parsed.messages)
      ? parsed.messages.map(normalizeMessage).filter((message): message is TeamTalkMessage => Boolean(message))
      : [];

    return {
      messages: messages.length > 0 ? messages : [createWelcomeMessage()],
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString()
    };
  } catch {
    return {
      messages: [createWelcomeMessage()],
      updatedAt: new Date().toISOString()
    };
  }
}

async function saveState(messages: TeamTalkMessage[]) {
  await mkdir(path.dirname(TEAM_TALK_STORE_PATH), { recursive: true });
  await writeFile(
    TEAM_TALK_STORE_PATH,
    JSON.stringify(
      {
        messages,
        updatedAt: new Date().toISOString()
      },
      null,
      2
    ),
    "utf8"
  );
}

export async function getTeamTalkMessages(): Promise<TeamTalkMessage[]> {
  const state = await loadState();
  return [...state.messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function appendTeamTalkMessages(messagesToAppend: TeamTalkMessage[]) {
  const current = await getTeamTalkMessages();
  const next = [...current, ...messagesToAppend].slice(-250);
  await saveState(next);
  return next;
}

export async function getTeamTalkMembers(): Promise<TeamTalkMember[]> {
  const employees = await listEmployees();
  return employees
    .filter((employee) => employee.active || employee.isSystem)
    .map(toMember)
    .sort((a, b) => {
      if (Boolean(a.isSystem) !== Boolean(b.isSystem)) {
        return a.isSystem ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
}

export async function getTeamTalkSnapshot() {
  const [messages, members] = await Promise.all([getTeamTalkMessages(), getTeamTalkMembers()]);
  return { messages, members };
}
