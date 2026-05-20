export type TeamTalkMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  photoUrl: string | null;
  active: boolean;
  isSystem?: boolean;
};

export type TeamTalkAuthor = TeamTalkMember & {
  kind: "human" | "system";
};

export type TeamTalkMention = TeamTalkMember;

export type TeamTalkMessage = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  kind: "message" | "system";
  author: TeamTalkAuthor;
  mentions: TeamTalkMention[];
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function createAuthorSnapshot(member: TeamTalkMember, kind: TeamTalkAuthor["kind"]): TeamTalkAuthor {
  return {
    ...member,
    kind
  };
}

export function resolveMentionSnapshots(content: string, members: TeamTalkMember[]) {
  const lower = content.toLowerCase();
  const ordered = members.slice().sort((a, b) => b.name.length - a.name.length);

  const matches: TeamTalkMention[] = [];
  const seen = new Set<string>();

  for (const member of ordered) {
    const needle = `@${normalizeText(member.name)}`;
    if (lower.includes(needle) && !seen.has(member.id)) {
      matches.push(member);
      seen.add(member.id);
    }
  }

  return matches;
}

export function resolveMentionSnapshotsByIds(mentionIds: string[], members: TeamTalkMember[]) {
  const uniqueIds = [...new Set(mentionIds.filter(Boolean))];
  return uniqueIds
    .map((id) => members.find((member) => member.id === id))
    .filter((member): member is TeamTalkMention => member !== undefined);
}

