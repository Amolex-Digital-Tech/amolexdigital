"use client";

import { useMemo, useState } from "react";
import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, ExternalLink, Twitter, Instagram, Facebook, Linkedin, Users, Heart, MessageCircle, Share2, FileText } from "lucide-react";

const providerIcons: Record<string, typeof Twitter> = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin
};

type SocialAccount = {
  id: string;
  provider: string;
  account_handle: string;
  external_id: string;
  created_at: string;
};

type SocialMetrics = {
  followers: number;
  likes: number;
  comments: number;
  shares: number;
  posts: number;
};

// Sample data for demo
const SAMPLE_ACCOUNTS: SocialAccount[] = [
  { id: "1", provider: "Instagram", account_handle: "amolex_tech", external_id: "ig_123456", created_at: "2024-01-15" },
  { id: "2", provider: "Twitter", account_handle: "AmolexTech", external_id: "tw_789012", created_at: "2024-02-01" },
  { id: "3", provider: "Facebook", account_handle: "AmolexDigital", external_id: "fb_345678", created_at: "2024-02-15" },
  { id: "4", provider: "LinkedIn", account_handle: "amolex-digital", external_id: "li_901234", created_at: "2024-03-01" }
];

const SAMPLE_METRICS: Record<string, SocialMetrics> = {
  Instagram: { followers: 182_400, likes: 420_000, comments: 18_200, shares: 24_500, posts: 640 },
  Twitter: { followers: 96_200, likes: 210_000, comments: 14_300, shares: 32_400, posts: 1_240 },
  Facebook: { followers: 145_800, likes: 380_500, comments: 26_400, shares: 41_200, posts: 970 },
  LinkedIn: { followers: 61_300, likes: 128_400, comments: 9_800, shares: 6_400, posts: 540 }
};

export default function ClientSocialPage() {
  const accounts = SAMPLE_ACCOUNTS;
  const [selectedId, setSelectedId] = useState<string>(accounts[0]?.id ?? "");

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedId) ?? accounts[0],
    [accounts, selectedId]
  );
  const metrics = selectedAccount ? SAMPLE_METRICS[selectedAccount.provider] : null;

  return (
    <ClientDashboardShell title="Social Accounts" description="Tap an account to see followers, engagement, and posting stats.">
      {accounts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {accounts.map((account) => {
              const Icon = providerIcons[account.provider.toLowerCase()] ?? Link2;
              const active = account.id === selectedAccount?.id;
              return (
                <Card
                  key={account.id}
                  className={`cursor-pointer transition ${active ? "border-primary shadow-glow" : "hover:border-muted"}`}
                  onClick={() => setSelectedId(account.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${active ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.provider}</CardTitle>
                      <p className="text-sm text-muted-foreground">@{account.account_handle}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {account.external_id && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ExternalLink className="h-4 w-4" />
                        <span>ID: {account.external_id}</span>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Connected on {new Date(account.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {metrics && selectedAccount && (
            <Card className="h-full rounded-2xl border border-lime-200/70 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {selectedAccount.provider} Overview
                </CardTitle>
                <p className="text-sm text-muted-foreground">@{selectedAccount.account_handle}</p>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <MetricTile icon={Users} label="Followers" value={metrics.followers} />
                <MetricTile icon={Heart} label="Likes" value={metrics.likes} />
                <MetricTile icon={MessageCircle} label="Comments" value={metrics.comments} />
                <MetricTile icon={Share2} label="Shares" value={metrics.shares} />
                <MetricTile icon={FileText} label="Posts" value={metrics.posts} />
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Link2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Social Accounts</h3>
          <p className="mt-2 text-muted-foreground">
            Connect your social media accounts to start tracking analytics.
          </p>
        </Card>
      )}
    </ClientDashboardShell>
  );
}

function MetricTile({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-lime-200/70 bg-[#f7fbf3] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-[#1f2a17]">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
