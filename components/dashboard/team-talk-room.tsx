"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  AtSign,
  Loader2,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  resolveMentionSnapshots,
  type TeamTalkMember,
  type TeamTalkMessage,
  type TeamTalkMention,
} from "@/lib/team-talk-shared";

type PortalSessionUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  position?: string | null;
  photoUrl?: string | null;
};

type TeamTalkSnapshot = {
  messages: TeamTalkMessage[];
  members: TeamTalkMember[];
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTrailingMentionState(value: string) {
  const match = value.match(/(^|\s)@([^\s@]*)$/);
  if (!match || typeof match.index !== "number") {
    return null;
  }

  return {
    index: match.index,
    prefix: match[1] ?? "",
    query: match[2] ?? ""
  };
}

function replaceTrailingMention(value: string, name: string) {
  const state = getTrailingMentionState(value);
  if (!state) {
    const spacer = value.length > 0 && !value.endsWith(" ") ? " " : "";
    return `${value}${spacer}@${name} `;
  }

  return `${value.slice(0, state.index)}${state.prefix}@${name} `;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

function isToday(value: string) {
  const date = new Date(value);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function renderMessageContent(content: string, mentions: TeamTalkMention[]): ReactNode {
  const mentionNames = [...new Set(mentions.map((mention) => mention.name))]
    .sort((a, b) => b.length - a.length);

  const mentionPattern =
    mentionNames.length > 0
      ? new RegExp(`(@(?:${mentionNames.map(escapeRegExp).join("|")}))`, "g")
      : null;

  return content.split("\n").map((line, lineIndex) => {
    const parts = mentionPattern ? line.split(mentionPattern) : [line];

    return (
      <span key={`${lineIndex}-${line.slice(0, 12)}`}>
        {parts.map((part, partIndex) => {
          const matchedMention = mentions.find((mention) => `@${mention.name}` === part);

          if (matchedMention) {
            return (
              <span
                key={`${lineIndex}-${partIndex}-${matchedMention.id}`}
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-blue-700"
              >
                {part}
              </span>
            );
          }

          return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
        })}
        {lineIndex < content.split("\n").length - 1 ? <br /> : null}
      </span>
    );
  });
}

export function TeamTalkRoom() {
  const { data: session } = useSession();
  const sessionUser = session?.user as PortalSessionUser | undefined;
  const [messages, setMessages] = useState<TeamTalkMessage[]>([]);
  const [members, setMembers] = useState<TeamTalkMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMember = useMemo(() => {
    if (!sessionUser?.email) {
      return null;
    }

    return members.find((member) => member.email.toLowerCase() === sessionUser.email?.toLowerCase()) ?? null;
  }, [members, sessionUser?.email]);

  const displayName = currentMember?.name ?? sessionUser?.name ?? "Team member";
  const displayEmail = currentMember?.email ?? sessionUser?.email ?? "";
  const displayPhoto = currentMember?.photoUrl ?? sessionUser?.photoUrl ?? null;
  const displayInitials = (displayName || displayEmail)
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TM";

  const activeMembers = members.filter((member) => member.active || member.isSystem);
  const todayMessages = messages.filter((message) => isToday(message.createdAt));
  const todayMentions = todayMessages.reduce((count, message) => count + message.mentions.length, 0);
  const mentionState = useMemo(() => getTrailingMentionState(draft), [draft]);
  const mentionSuggestions = useMemo(() => {
    if (!mentionState) {
      return [];
    }

    const query = mentionState.query.toLowerCase();
    return activeMembers
      .filter((member) =>
        query.length === 0 ? true : member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [activeMembers, mentionState]);

  async function loadSnapshot(silent = false) {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/admin/team-talk", {
        method: "GET",
        cache: "no-store"
      });
      const result = (await response.json()) as TeamTalkSnapshot & { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to load team talk.");
      }

      setError(null);
      setMessages(result.messages ?? []);
      setMembers(result.members ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load team talk.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadSnapshot(false);
    const interval = window.setInterval(() => {
      void loadSnapshot(true);
    }, 15000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function applyMention(member: TeamTalkMember) {
    setDraft((current) => replaceTrailingMention(current, member.name));
    textareaRef.current?.focus();
  }

  async function submitMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || sending) {
      return;
    }

    const mentionSnapshots = resolveMentionSnapshots(trimmed, members);
    setError(null);
    setSending(true);

    try {
      const response = await fetch("/api/admin/team-talk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: trimmed,
          mentionIds: mentionSnapshots.map((mention) => mention.id)
        })
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to send message.");
      }

      setDraft("");
      await loadSnapshot(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to send message.");
    } finally {
      setSending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitMessage(draft);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(draft);
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <Card className="overflow-hidden border-blue-100 bg-white shadow-[0_20px_45px_rgba(37,99,235,0.08)]">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              Loading team talk...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-r from-white via-blue-50/70 to-white px-6 py-7 shadow-[0_18px_55px_rgba(37,99,235,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.12),transparent_26%),radial-gradient(circle_at_85%_0%,rgba(14,165,233,0.12),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge className="border-blue-200 bg-blue-100 text-blue-700">Team Talk</Badge>
            <h1 className="mt-4 font-heading text-4xl font-semibold text-slate-900">
              Simple team chat for fast updates and mentions.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Share short updates, mention teammates with <span className="font-semibold text-blue-700">@Name</span>,
              and keep the thread moving without leaving the portal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="border-blue-200 bg-blue-50 text-blue-700">
              {activeMembers.length} active members
            </Badge>
            <Badge className="border-sky-200 bg-sky-50 text-sky-700">
              {todayMessages.length} messages today
            </Badge>
          </div>
        </div>

        <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Today</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{todayMessages.length}</p>
            <p className="mt-1 text-sm text-slate-500">Messages posted in the room.</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mentions</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{todayMentions}</p>
            <p className="mt-1 text-sm text-slate-500">Teammates pulled into the thread.</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Members</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{activeMembers.length}</p>
            <p className="mt-1 text-sm text-slate-500">Active teammates in the room.</p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <Card className="overflow-hidden border-blue-100 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
          <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-white to-blue-50/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Live team room</CardTitle>
                  <CardDescription className="mt-1">
                    Everyone in the portal can coordinate here. Use mentions to loop people in.
                  </CardDescription>
                </div>
              </div>
              {refreshing ? (
                <Badge className="border-sky-200 bg-sky-50 text-sky-700">Refreshing</Badge>
              ) : null}
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-5">
            <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1">
              {messages.map((message) => {
                if (message.kind === "system") {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <div className="max-w-[90%] rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-center text-sm text-slate-600">
                        <span className="font-semibold text-blue-700">{message.author.name}</span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="whitespace-pre-wrap">{renderMessageContent(message.content, message.mentions)}</span>
                      </div>
                    </div>
                  );
                }

                const isMine = message.author.email.toLowerCase() === displayEmail.toLowerCase();

                return (
                  <div key={message.id} className={cn("flex gap-3", isMine ? "justify-end" : "justify-start")}>
                    {!isMine ? (
                      <Avatar className="mt-1 h-11 w-11 border border-blue-100 bg-white">
                        <AvatarImage src={message.author.photoUrl ?? undefined} />
                        <AvatarFallback className="bg-slate-100 text-slate-700">
                          {message.author.name
                            .split(/\s+/)
                            .map((part) => part[0] || "")
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : null}

                    <div
                      className={cn(
                        "max-w-[88%] rounded-[1.6rem] border px-4 py-3 shadow-sm",
                        isMine ? "border-blue-600 bg-blue-600 text-white" : "border-blue-100 bg-white text-slate-900"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={cn("text-sm font-semibold", isMine ? "text-white" : "text-slate-900")}>
                          {message.author.name}
                        </p>
                        <Badge
                          className={cn(
                            "px-2 py-0.5 text-[10px] tracking-[0.16em]",
                            isMine
                              ? "border-white/30 bg-white/15 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          )}
                        >
                          {message.author.position}
                        </Badge>
                        <span className={cn("text-xs", isMine ? "text-blue-100" : "text-slate-400")}>
                          {formatDate(message.createdAt)}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "mt-3 whitespace-pre-wrap text-sm leading-7",
                          isMine ? "text-white" : "text-slate-700"
                        )}
                      >
                        {renderMessageContent(message.content, message.mentions)}
                      </div>

                      {message.mentions.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.mentions.map((mention) => (
                            <Badge
                              key={mention.id}
                              className={cn(
                                "px-2 py-1 text-[10px] tracking-[0.14em]",
                                isMine
                                  ? "border-white/25 bg-white/15 text-white"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                              )}
                            >
                              @{mention.name}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {isMine ? (
                      <Avatar className="mt-1 h-11 w-11 border border-blue-100 bg-white">
                        <AvatarImage src={displayPhoto ?? undefined} />
                        <AvatarFallback className="bg-blue-600 text-white">{displayInitials}</AvatarFallback>
                      </Avatar>
                    ) : null}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 rounded-[1.6rem] border border-blue-100 bg-gradient-to-b from-white to-blue-50/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Write to the team</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <AtSign className="h-3.5 w-3.5" />
                  Type `@` to mention someone
                </div>
              </div>

              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share an update, ask a question, or mention someone by name..."
                  className="min-h-[150px] rounded-[1.4rem] border-blue-100 bg-white px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:ring-blue-200"
                />

                {mentionState ? (
                  <div className="absolute left-4 right-4 top-full z-20 mt-2 rounded-[1.25rem] border border-blue-100 bg-white p-3 shadow-[0_18px_35px_rgba(37,99,235,0.12)]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      <Users className="h-3.5 w-3.5 text-blue-500" />
                      Mention someone
                    </div>
                    <div className="grid gap-2">
                      {mentionSuggestions.length > 0 ? (
                        mentionSuggestions.map((member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => applyMention(member)}
                            className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-left transition hover:border-blue-100 hover:bg-blue-50"
                          >
                            <Avatar className="h-9 w-9 border border-blue-100">
                              <AvatarImage src={member.photoUrl ?? undefined} />
                              <AvatarFallback className="bg-blue-50 text-blue-700">
                                {member.name
                                  .split(/\s+/)
                                  .map((part) => part[0] || "")
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.position}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-slate-500">No matching team members.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Press Enter to send. Use Shift+Enter for a new line.
                </p>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  disabled={sending || draft.trim().length === 0}
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send to team
                </Button>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-blue-100 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
            <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-white to-blue-50/60">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>People in the room</CardTitle>
                  <CardDescription>Tap a name to insert a mention directly into the composer.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
              {activeMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => applyMention(member)}
                  className="flex w-full items-center gap-3 rounded-[1.3rem] border border-blue-100 bg-white px-3 py-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <Avatar className="h-11 w-11 border border-blue-100">
                    <AvatarImage src={member.photoUrl ?? undefined} />
                    <AvatarFallback className="bg-blue-50 text-blue-700">
                      {member.name
                        .split(/\s+/)
                        .map((part) => part[0] || "")
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{member.name}</p>
                    <p className="truncate text-xs text-slate-500">{member.position}</p>
                  </div>
                  <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700">
                    {member.isSystem ? "System" : "Online"}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-gradient-to-br from-blue-600 to-sky-600 text-white shadow-[0_18px_45px_rgba(37,99,235,0.16)]">
            <CardContent className="space-y-4 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/75">Room tips</p>
              <h3 className="text-2xl font-semibold">Keep updates short and clear</h3>
              <div className="space-y-3 text-sm leading-7 text-white/90">
                <p>1. Post a quick update when something changes.</p>
                <p>2. Mention a teammate with `@Name` to pull them in.</p>
                <p>3. Keep replies focused on the next action.</p>
              </div>
              <Button asChild variant="secondary" className="w-full justify-center bg-white text-slate-900 hover:bg-white/90">
                <Link href="/dashboard/admin/settings?onboarding=photo">
                  Keep your profile photo updated
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
