"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ArrowUpRight, Ellipsis, X, Eye, Clock3, Wallet, Activity, User2 } from "lucide-react";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MetricKey = "totalReach" | "adCampaign" | "followerGrowth" | "totalEngagements" | "watchingHour" | "ctrAds";

type OverviewMetrics = {
  totalReach: number;
  reachChange: number;
  watchedSeconds: number;
  watchedChange: number;
  adSpend: number;
  adChange: number;
  engagementRate: number;
  engagementChange: number;
};

const DEFAULT_METRICS: OverviewMetrics = {
  totalReach: 684_294,
  reachChange: 12,
  watchedSeconds: 112_482, // 31H,14M,42S
  watchedChange: 22,
  adSpend: 200,
  adChange: 6,
  engagementRate: 27,
  engagementChange: 3
};

type PerformancePoint = {
  month: string;
  followerGrowth: number;
  adCampaign: number;
  watchingHour: number;
  totalReach: number;
  totalEngagements: number;
  ctrAds: number;
};

const performanceData: PerformancePoint[] = [
  { month: "Jan", followerGrowth: 120000, adCampaign: 110000, watchingHour: 95000, totalReach: 160000, totalEngagements: 120000, ctrAds: 80000 },
  { month: "Feb", followerGrowth: 150000, adCampaign: 140000, watchingHour: 115000, totalReach: 180000, totalEngagements: 135000, ctrAds: 90000 },
  { month: "Mar", followerGrowth: 170000, adCampaign: 158000, watchingHour: 125000, totalReach: 200000, totalEngagements: 150000, ctrAds: 98000 },
  { month: "Apr", followerGrowth: 190000, adCampaign: 165000, watchingHour: 138000, totalReach: 225000, totalEngagements: 168000, ctrAds: 105000 },
  { month: "May", followerGrowth: 210000, adCampaign: 180000, watchingHour: 150000, totalReach: 240000, totalEngagements: 175000, ctrAds: 112000 },
  { month: "Jun", followerGrowth: 230000, adCampaign: 196000, watchingHour: 162000, totalReach: 265000, totalEngagements: 188000, ctrAds: 120000 },
  { month: "Jul", followerGrowth: 260000, adCampaign: 215000, watchingHour: 170000, totalReach: 280000, totalEngagements: 205000, ctrAds: 132000 }
];

const monthSlices = [
  { key: "m1", name: "1st month", value: 25, color: "#A26BE0" },
  { key: "m2", name: "2nd month", value: 20, color: "#EC5D69" },
  { key: "m3", name: "3rd month", value: 18, color: "#4B7BFF" },
  { key: "m4", name: "4th month", value: 22, color: "#7BAF2D" },
  { key: "m5", name: "5th month", value: 15, color: "#E4C24C" }
];

const metricOptions: { key: MetricKey; label: string; color: string }[] = [
  { key: "totalReach", label: "Total Reach", color: "#A26BE0" },
  { key: "adCampaign", label: "Ad Campaign", color: "#EC5D69" },
  { key: "followerGrowth", label: "Follower Growth", color: "#4B7BFF" },
  { key: "totalEngagements", label: "Total Engagements", color: "#F57DBE" },
  { key: "watchingHour", label: "Watching Hour", color: "#E4C24C" },
  { key: "ctrAds", label: "CTR (Ads)", color: "#7BAF2D" }
];

const monthOptions = monthSlices.map(({ key, name, color }) => ({ key, label: name, color }));

const RADIAN = Math.PI / 180;
function renderMonthLabel({ cx, cy, midAngle, outerRadius, percent, name }: any) {
  const radius = outerRadius + 16;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#1f2a17"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {name} {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

function formatSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const two = (n: number) => String(n).padStart(2, "0");
  return `${hours}H,${two(minutes)}M,${two(secs)}S`;
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function toCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function TooltipContent({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-lime-200 bg-white/95 p-3 shadow-sm">
      <p className="text-xs font-semibold text-[#4d5a44]">{label}</p>
      <div className="mt-2 space-y-1 text-sm">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-[#4f5d52]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-semibold text-[#1f2a17]">{formatNumber(entry.value ?? 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Amolex Digital Tech");
  const [metrics, setMetrics] = useState<OverviewMetrics>(DEFAULT_METRICS);
  const [periodRange, setPeriodRange] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("totalReach");
  const [selectedMonth, setSelectedMonth] = useState<string>("m1");
  const [logoPopupSrc, setLogoPopupSrc] = useState<string | null>(null);
  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const [projects, setProjects] = useState<string[]>(["Project 1"]);
  const [selectedProject, setSelectedProject] = useState<string>("Project 1");
  const initials = useMemo(
    () =>
      companyName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [companyName]
  );

  useEffect(() => {
    const clientSession = localStorage.getItem("client_session");

    if (!clientSession) {
      router.replace("/dashboard/sign-in");
      return;
    }

    const sessionData = JSON.parse(clientSession);
    const company =
      localStorage.getItem("user_company_name") ||
      sessionData.companyName ||
      "Amolex Digital Tech";

    setCompanyName(company);
    localStorage.setItem("user_company_name", company);

    const storageKey = `metrics_${company.toLowerCase().replace(/\s/g, "_")}`;
    const storedMetrics = localStorage.getItem(storageKey);
    const projectKey = `projects_${company.toLowerCase().replace(/\s/g, "_")}`;
    const storedProjects = localStorage.getItem(projectKey);

    if (storedMetrics) {
      try {
        const parsed = JSON.parse(storedMetrics);
        const reach = parsed.impressions ?? DEFAULT_METRICS.totalReach;
        const engagementRate = parsed.engagementRate
          ? Number(parsed.engagementRate)
          : reach > 0
            ? Math.min(
                99,
                Math.round(
                  (((parsed.likes ?? 0) + (parsed.shares ?? 0) + (parsed.clicks ?? 0)) / reach) * 100
                )
              )
            : DEFAULT_METRICS.engagementRate;

        if (parsed.periodStart && parsed.periodEnd) {
          setPeriodRange(`${parsed.periodStart} → ${parsed.periodEnd}`);
        } else if (parsed.periodEnd) {
          setPeriodRange(`Week ending ${parsed.periodEnd}`);
        }
        if (parsed.updatedAt) {
          setLastUpdated(parsed.updatedAt);
        }

        setMetrics((prev) => ({
          ...prev,
          totalReach: reach,
          engagementRate,
          adSpend: parsed.adSpend ?? (parsed.posts ? Math.max(prev.adSpend, Number(parsed.posts) * 10) : prev.adSpend),
          watchedSeconds: parsed.watchedSeconds ?? prev.watchedSeconds,
          reachChange: parsed.reachChange ?? prev.reachChange,
          watchedChange: parsed.watchedChange ?? prev.watchedChange,
          adChange: parsed.adChange ?? prev.adChange,
          engagementChange: parsed.engagementChange ?? prev.engagementChange
        }));
      } catch (error) {
        console.error("Failed to parse stored metrics", error);
      }
    }

    if (storedProjects) {
      try {
        const list = JSON.parse(storedProjects);
        if (Array.isArray(list) && list.length > 0) {
          setProjects(list);
          setSelectedProject(list[0]);
        }
      } catch (error) {
        console.error("Failed to parse stored projects", error);
      }
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (loading || !companyName) return;

    const companyKey = companyName.toLowerCase().replace(/\s/g, "_");
    const logoKey = `client_logo_${companyKey}`;
    const storedLogo = localStorage.getItem(logoKey);

    if (storedLogo) {
      const seenKey = `logo_popup_seen_${logoKey}`;
      if (!sessionStorage.getItem(seenKey)) {
        sessionStorage.setItem(seenKey, "1");
        setShowLogoPopup(true);
      }
      setLogoPopupSrc(storedLogo);
    } else {
      setLogoPopupSrc(null);
      setShowLogoPopup(false);
    }
  }, [companyName, loading]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
    []
  );

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: Eye,
      label: "Total Reach",
      value: formatNumber(metrics.totalReach),
      change: `+${metrics.reachChange}%`,
      accent: "#6AA232"
    },
    {
      icon: Clock3,
      label: "Watched Hour",
      value: formatSeconds(metrics.watchedSeconds),
      change: `+${metrics.watchedChange}%`,
      accent: "#47630F"
    },
    {
      icon: Wallet,
      label: "Ad Spend / Budget",
      value: toCurrency(metrics.adSpend),
      change: `+${metrics.adChange}%`,
      accent: "#1F2A17"
    },
    {
      icon: Activity,
      label: "Engagement Rate",
      value: `${metrics.engagementRate}%`,
      change: `+${metrics.engagementChange}pt`,
      accent: "#2C8C2C"
    }
  ];

  return (
    <>
      {showLogoPopup && logoPopupSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="relative w-full max-w-md rounded-2xl border border-lime-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowLogoPopup(false)}
              className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground transition hover:bg-muted"
              aria-label="Close logo popup"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f5d42]">Client Portal</p>
            <h3 className="mt-1 text-xl font-semibold text-[#1f2a17]">Welcome back</h3>
            <div className="mt-4 flex justify-center">
              <img
                src={logoPopupSrc}
                alt={`${companyName} logo`}
                className="max-h-36 w-auto rounded-xl border border-lime-200/80 bg-[#f8fbf3] p-3"
              />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              This logo was added by your account manager for quick brand verification.
            </p>
            <Button className="mt-5 w-full" onClick={() => setShowLogoPopup(false)}>
              Continue to dashboard
            </Button>
          </div>
        </div>
      )}
      <ClientDashboardShell title="" description="" hideHeader>
      <div className="space-y-8 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 pb-12 bg-[#F8FAFC]" >
        <div className="relative overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-md">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.28)_1px,_transparent_0)] [background-size:18px_18px]" />
          <div className="relative space-y-8 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6c58]">
                  AMOLEX DIGITAL TECH
                </p>
                <h2 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">
                  Welcome, {companyName}
                </h2>
                <p className="text-sm text-[#64748B]">Here&apos;s your performance overview</p>
                <p className="text-xs font-medium text-[#94A3B8]">
                  Updated {lastUpdated ? new Date(lastUpdated).toLocaleString() : todayLabel}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="inline-flex items-center gap-1 rounded-lg border border-[#bbf7d0] bg-[#ECFDF5] px-3 py-2 text-sm font-semibold text-[#15803D] shadow-sm">
                  <select
                    className="bg-transparent text-[#15803D] outline-none"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    disabled={projects.length <= 1}
                  >
                    {projects.map((project) => (
                      <option key={project} value={project} className="text-[#15803D]">
                        {project}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs">▼</span>
                </div>
                <Link
                  href="/dashboard/client/settings"
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#e2e8f0] bg-white shadow-sm hover:shadow-md transition"
                  title="Open settings"
                >
                  {logoPopupSrc ? (
                    <img src={logoPopupSrc} alt={`${companyName} logo`} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {initials || <User2 className="h-4 w-4" />}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-md"
                >
                  <div className="flex items-start justify-between text-[13px] font-semibold text-[#0F172A]">
                    <span className="inline-flex items-center gap-2">
                      {stat.icon ? (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F5F9] text-[#16A34A] shadow-sm">
                          <stat.icon className="h-4 w-4" strokeWidth={2.3} />
                        </span>
                      ) : null}
                      {stat.label}
                    </span>
                    <Ellipsis className="h-4 w-4 text-[#9aa897]" />
                  </div>
                  <div className="pb-1">
                    <div className="mt-3 text-[28px] font-semibold text-[#0F172A]">{stat.value}</div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#475569]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-1 text-xs font-semibold text-[#16A34A]">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {stat.change}
                      </span>
                      <span className="text-[#94A3B8]">vs last period</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <Card className="border border-[#e2e8f0] bg-white shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3 pl-2 sm:pl-3">
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-[#0F172A]">Growth Over Time</p>
                    <p className="text-sm font-medium text-[#64748B]">Track performance trends across selected period</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {metricOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setSelectedMetric(option.key)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          selectedMetric === option.key
                            ? "bg-[#d8e7c7] text-[#1f2a17] shadow-[0_6px_14px_rgba(142,185,86,0.35)]"
                            : "border border-[#dfe7d9] bg-white text-[#5a6557] hover:bg-[#eef5e9]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative mt-6 h-[320px] w-full overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/5 via-black/0 to-transparent" />
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8efe3" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6b7568", fontSize: 12 }} />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                        tick={{ fill: "#6b7568", fontSize: 12 }}
                      />
                      <Tooltip content={<TooltipContent />} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                      {metricOptions.map((option) =>
                        option.key === selectedMetric ? (
                          <Line
                            key={option.key}
                            type="monotone"
                            dataKey={option.key}
                            name={option.label}
                            stroke={option.color}
                            strokeWidth={3.5}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 7 }}
                          />
                        ) : null
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="flex h-full flex-col gap-4 border border-[#e2e8f0] bg-white p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-[#1f2a17]">Performance Breakdown</p>
                    <p className="text-sm text-[#55604f]">Reach vs Engagement vs Clicks</p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="h-[220px] w-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={monthSlices}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          startAngle={90}
                          endAngle={-270}
                        >
                          {monthSlices.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid w-full grid-cols-3 gap-2 text-sm text-[#4f5d52]">
                    <div className="flex items-center gap-2 rounded-xl border border-[#eef3e8] bg-[#f7faf4] px-3 py-2">
                      <span className="h-3 w-3 rounded-full bg-[#7BAF2D]" />
                      <div>
                        <p className="font-semibold">Reach</p>
                        <p className="text-xs text-[#6b7568]">62%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[#eef3e8] bg-[#f7faf4] px-3 py-2">
                      <span className="h-3 w-3 rounded-full bg-[#A26BE0]" />
                      <div>
                        <p className="font-semibold">Engagement</p>
                        <p className="text-xs text-[#6b7568]">22%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[#eef3e8] bg-[#f7faf4] px-3 py-2">
                      <span className="h-3 w-3 rounded-full bg-[#4B7BFF]" />
                      <div>
                        <p className="font-semibold">Clicks</p>
                        <p className="text-xs text-[#6b7568]">16%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Engagement increased by 18% this month",
                "Video content performs best",
                "Instagram drives most traffic",
                "Strong upward growth trend lately"
              ].map((insight, idx) => (
                <div
                  key={insight}
                  className="flex items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-4 py-4 text-sm font-medium text-[#0F172A] shadow-sm"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#e7f0de] text-[#2c7a2c] text-base">
                    {["↗", "🎬", "📈", "🚀"][idx]}
                  </span>
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientDashboardShell>
    </>
  );
}
