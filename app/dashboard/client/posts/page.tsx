"use client";

import { useEffect, useMemo, useState } from "react";
import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, Share2, MessageCircle, Bookmark, Calendar } from "lucide-react";

type SocialPost = {
  id: string;
  platform: string;
  description: string;
  postedAt: string;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
};

type CalendarEntry = {
  id: string;
  date: string;
  platform: string;
  type: string;
  contentType: string;
  status: string;
  note?: string;
};

const SAMPLE_POSTS: SocialPost[] = [
  { id: "p1", platform: "Instagram", description: "Excited to announce our new partnership! 🎉 Check out our latest project...", postedAt: "2024-03-15", impressions: 1200, likes: 156, shares: 45, comments: 23, saves: 12 },
  { id: "p2", platform: "Instagram", description: "Behind the scenes of our latest campaign 📸 #amolex #digital", postedAt: "2024-02-28", impressions: 2100, likes: 312, shares: 89, comments: 56, saves: 44 },
  { id: "p3", platform: "TikTok", description: "Product demo in 30 seconds ⚡️", postedAt: "2024-03-12", impressions: 3400, likes: 540, shares: 120, comments: 68, saves: 95 },
  { id: "p4", platform: "LinkedIn", description: "We’re hiring! Join our growth team.", postedAt: "2024-03-05", impressions: 980, likes: 203, shares: 67, comments: 45, saves: 10 }
];

export default function ClientPostsPage() {
  const [posts, setPosts] = useState<SocialPost[]>(SAMPLE_POSTS);
  const [platform, setPlatform] = useState<string>("Instagram");
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);

  useEffect(() => {
    const company = localStorage.getItem("user_company_name") || "amolex";
    const storageKey = `metrics_${company.toLowerCase().replace(/\s/g, "_")}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.postsData && Array.isArray(parsed.postsData)) {
          setPosts(parsed.postsData);
          if (parsed.postsData[0]?.platform) setPlatform(parsed.postsData[0].platform);
        }
      } catch (e) {
        console.error("Failed to parse posts", e);
      }
    }

    const calendarKey = `calendar_${company.toLowerCase().replace(/\s/g, "_")}`;
    const storedCalendar = localStorage.getItem(calendarKey);
    if (storedCalendar) {
      try {
        setCalendarEntries(JSON.parse(storedCalendar));
      } catch {
        setCalendarEntries([]);
      }
    }
  }, []);

  const platforms = useMemo(() => {
    const set = new Set(posts.map((p) => p.platform));
    return Array.from(set);
  }, [posts]);

  const filtered = posts.filter((p) => p.platform === platform);

  return (
    <ClientDashboardShell title="Posts" description="Pick a platform to see post-level performance.">
      {platforms.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${platform === p ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {post.description?.slice(0, 120) || "Post"}
                    {(post.description?.length ?? 0) > 120 && "..."}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.postedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <Metric icon={Eye} label="Impressions" value={post.impressions} />
                  <Metric icon={Heart} label="Likes" value={post.likes} />
                  <Metric icon={MessageCircle} label="Comments" value={post.comments} />
                  <Metric icon={Share2} label="Shares" value={post.shares} />
                  <Metric icon={Bookmark} label="Saves" value={post.saves} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <h3 className="mt-4 text-lg font-semibold">No posts for {platform}</h3>
          <p className="mt-2 text-muted-foreground">Add posts in the admin panel for this platform.</p>
        </Card>
      )}

      {calendarEntries.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="text-lg font-semibold">Scheduled (Marketing Calendar)</h3>
          <div className="space-y-2">
            {calendarEntries
              .filter((e) => !platform || e.platform === platform)
              .map((entry) => (
                <Card key={entry.id} className="rounded-xl border border-lime-200/70 bg-[#f7fbf3]">
                  <CardContent className="flex flex-col gap-1 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#1f2a17]">{entry.platform} — {entry.type}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Content: {entry.contentType} • Status: {entry.status}
                    </div>
                    {entry.note && <p className="text-xs text-[#1f2a17]">Note: {entry.note}</p>}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </ClientDashboardShell>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="h-4 w-4" />
      <span className="font-medium">{value.toLocaleString()}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}
