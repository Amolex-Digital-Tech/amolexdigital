"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Download, CalendarDays, User } from "lucide-react";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card } from "@/components/ui/card";

type RangeKey = "7D" | "30D" | "90D" | "6M" | "1Y";

type KPI = { title: string; value: number; change: number; trend: "up" | "down"; suffix?: string };

const DEFAULT_KPIS: KPI[] = [
  { title: "Impressions", value: 684_294, change: 12, trend: "up" },
  { title: "Engagement", value: 27, change: 3.4, trend: "up", suffix: "%" },
  { title: "Clicks", value: 22_900, change: 6.1, trend: "up" },
  { title: "Shares", value: 12_500, change: -1.8, trend: "down" }
];

const lineSeriesColors = {
  impressions: "#4BAE4F",
  engagement: "#7B9C3E",
  clicks: "#A6CE39"
};

const generateLineData = (days: number, base: { impressions: number; engagement: number; clicks: number }) =>
  Array.from({ length: days }).map((_, i) => {
    const day = i + 1;
    return {
      day: `Day ${day}`,
      impressions: base.impressions * 0.75 + Math.sin(i / 4) * (base.impressions * 0.08) + i * 1200,
      engagement: base.engagement * 0.8 + Math.cos(i / 5) * (base.engagement * 0.12) + i * 0.05,
      clicks: base.clicks * 0.7 + Math.sin(i / 6) * (base.clicks * 0.15) + i * 180
    };
  });

const DEFAULT_DONUT = [
  { name: "Likes", value: 42, color: "#6BBF59" },
  { name: "Comments", value: 18, color: "#94D17C" },
  { name: "Shares", value: 24, color: "#C4E7AA" },
  { name: "Saves", value: 16, color: "#E5F5D6" }
];

const DEFAULT_PLATFORMS = [
  { platform: "Instagram", value: 82 },
  { platform: "Facebook", value: 56 },
  { platform: "TikTok", value: 94 }
];

const DEFAULT_CONTENT = [
  { type: "Video", value: 92 },
  { type: "Carousel", value: 74 },
  { type: "Image", value: 58 }
];

const DEFAULT_INSIGHTS = [
  "Engagement increased by 18% this month.",
  "Video content generates 2x more engagement.",
  "Instagram contributes 65% of total reach.",
  "Consistent growth trend over the last 30 days."
];

const formatNumber = (n: number) => n.toLocaleString();

export default function ClientAnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30D");
  const [kpis, setKpis] = useState<KPI[]>(DEFAULT_KPIS);
  const [donut, setDonut] = useState(DEFAULT_DONUT);
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [insightsList, setInsightsList] = useState(DEFAULT_INSIGHTS);
  const [baseLine, setBaseLine] = useState({ impressions: 684_294, engagement: 27, clicks: 22_900 });
  const [lineData, setLineData] = useState(() => generateLineData(30, baseLine));
  const [analyticsRanges, setAnalyticsRanges] = useState<Record<RangeKey, any> | null>(null);
  const [analyticsUpdatedAt, setAnalyticsUpdatedAt] = useState<string | null>(null);
  const [analyticsAsOf, setAnalyticsAsOf] = useState<string | null>(null);

  useEffect(() => {
    const company = localStorage.getItem("user_company_name") || "amolex";
    const storageKey = `metrics_${company.toLowerCase().replace(/\s/g, "_")}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.analytics?.ranges) {
          setAnalyticsRanges(parsed.analytics.ranges);
          setAnalyticsUpdatedAt(parsed.analytics.updatedAt || null);
        }
      } catch (e) {
        console.error("Failed to parse analytics metrics", e);
      }
    }
  }, []);

  useEffect(() => {
    const source =
      analyticsRanges?.[range] ||
      analyticsRanges?.["30D"] ||
      null;

    const selected = source || null;

    const kpiSource = selected?.kpis || null;
    setKpis([
      {
        title: "Impressions",
        value: kpiSource?.impressions ?? DEFAULT_KPIS[0].value,
        change: kpiSource?.impressionsChange ?? DEFAULT_KPIS[0].change,
        trend: (kpiSource?.impressionsChange ?? DEFAULT_KPIS[0].change) >= 0 ? "up" : "down"
      },
      {
        title: "Engagement",
        value: kpiSource?.engagement ?? DEFAULT_KPIS[1].value,
        change: kpiSource?.engagementChange ?? DEFAULT_KPIS[1].change,
        trend: (kpiSource?.engagementChange ?? DEFAULT_KPIS[1].change) >= 0 ? "up" : "down",
        suffix: "%"
      },
      {
        title: "Clicks",
        value: kpiSource?.clicks ?? DEFAULT_KPIS[2].value,
        change: kpiSource?.clicksChange ?? DEFAULT_KPIS[2].change,
        trend: (kpiSource?.clicksChange ?? DEFAULT_KPIS[2].change) >= 0 ? "up" : "down"
      },
      {
        title: "Shares",
        value: kpiSource?.shares ?? DEFAULT_KPIS[3].value,
        change: kpiSource?.sharesChange ?? DEFAULT_KPIS[3].change,
        trend: (kpiSource?.sharesChange ?? DEFAULT_KPIS[3].change) >= 0 ? "up" : "down"
      }
    ]);

    setBaseLine({
      impressions: kpiSource?.impressions ?? DEFAULT_KPIS[0].value,
      engagement: kpiSource?.engagement ?? DEFAULT_KPIS[1].value,
      clicks: kpiSource?.clicks ?? DEFAULT_KPIS[2].value
    });

    const donutSource = selected?.donut;
    setDonut([
      { name: "Likes", value: donutSource?.likes ?? DEFAULT_DONUT[0].value, color: DEFAULT_DONUT[0].color },
      { name: "Comments", value: donutSource?.comments ?? DEFAULT_DONUT[1].value, color: DEFAULT_DONUT[1].color },
      { name: "Shares", value: donutSource?.shares ?? DEFAULT_DONUT[2].value, color: DEFAULT_DONUT[2].color },
      { name: "Saves", value: donutSource?.saves ?? DEFAULT_DONUT[3].value, color: DEFAULT_DONUT[3].color }
    ]);

    const platformSource = selected?.platforms;
    setPlatforms([
      { platform: "Instagram", value: platformSource?.instagram ?? DEFAULT_PLATFORMS[0].value },
      { platform: "Facebook", value: platformSource?.facebook ?? DEFAULT_PLATFORMS[1].value },
      { platform: "TikTok", value: platformSource?.tiktok ?? DEFAULT_PLATFORMS[2].value }
    ]);

    const contentSource = selected?.content;
    setContent([
      { type: "Video", value: contentSource?.video ?? DEFAULT_CONTENT[0].value },
      { type: "Carousel", value: contentSource?.carousel ?? DEFAULT_CONTENT[1].value },
      { type: "Image", value: contentSource?.image ?? DEFAULT_CONTENT[2].value }
    ]);

    const insightsSource = selected?.insights;
    setInsightsList(insightsSource?.length ? insightsSource.slice(0, 4) : DEFAULT_INSIGHTS);
    setAnalyticsAsOf(selected?.asOf || null);

    const days =
      range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 45 : range === "6M" ? 60 : 90;
    setLineData(generateLineData(days, {
      impressions: kpiSource?.impressions ?? DEFAULT_KPIS[0].value,
      engagement: kpiSource?.engagement ?? DEFAULT_KPIS[1].value,
      clicks: kpiSource?.clicks ?? DEFAULT_KPIS[2].value
    }));
  }, [range, analyticsRanges]);

  return (
    <ClientDashboardShell title="Analytics" description="Performance deep-dive for your marketing channels.">
      <div className="space-y-8">
        {/* Top navbar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-lime-200/70 bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-semibold text-[#14301f]">Birhan Ethiopia Speciality Clinic</div>
          <div className="flex flex-wrap items-center gap-2">
            {(["7D", "30D", "90D", "6M", "1Y"] as RangeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  range === key
                    ? "bg-[#1f5c32] text-white shadow-sm"
                    : "bg-[#f3f7f1] text-[#3d4b3f] hover:bg-[#e7efe4]"
                }`}
              >
                {key === "1Y" ? "1Y" : key === "6M" ? "6M" : key}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-lime-200 bg-[#f7fbf3] px-3 py-2 text-sm font-semibold text-[#1f2a17] hover:border-lime-300">
              <Download className="h-4 w-4" />
              Export
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9ead3] text-[#1f2a17]">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
        {(analyticsAsOf || analyticsUpdatedAt) && (
          <div className="text-xs text-[#55604f]">
            {analyticsAsOf && <span>Data as of: {new Date(analyticsAsOf).toLocaleString()}</span>}
            {analyticsAsOf && analyticsUpdatedAt && <span className="mx-2">•</span>}
            {analyticsUpdatedAt && <span>Last updated by admin: {new Date(analyticsUpdatedAt).toLocaleString()}</span>}
          </div>
        )}

        {/* Performance summary */}
        <section className="space-y-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6a7765]">Performance Summary</p>
            <p className="text-sm text-[#6a7765]">Last 30 Days</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <Card key={kpi.title} className="rounded-2xl border border-lime-200/70 bg-white shadow-sm">
                <div className="p-5">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="mt-2 text-3xl font-bold text-[#1f2a17]">
                    {kpi.suffix ? `${kpi.value}${kpi.suffix}` : formatNumber(kpi.value)}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={kpi.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {kpi.trend === "up" ? "+" : ""}
                      {kpi.change}% vs last period
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Growth over time */}
        <Card className="rounded-2xl border border-lime-200/70 bg-white shadow-sm">
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-lg font-semibold text-[#1f2a17]">Growth Over Time</p>
              <p className="text-sm text-[#6a7765]">Impressions, Engagement, Clicks</p>
            </div>
            <CalendarDays className="h-5 w-5 text-[#6a7765]" />
          </div>
          <div className="h-[320px] px-4 pb-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5ebdf" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#69736b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#69736b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e4ecd9" }}
                                    formatter={(value: unknown, name: unknown) => [formatNumber(Math.round(Number(value))), String(name)]}
                />
                <Legend />
                <Line type="monotone" dataKey="impressions" name="Impressions" stroke={lineSeriesColors.impressions} strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="engagement" name="Engagement" stroke={lineSeriesColors.engagement} strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="clicks" name="Clicks" stroke={lineSeriesColors.clicks} strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Two-column charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Engagement breakdown */}
          <Card className="rounded-2xl border border-lime-200/70 bg-white shadow-sm">
            <div className="p-5">
              <p className="text-lg font-semibold text-[#1f2a17]">Engagement Breakdown</p>
              <p className="text-sm text-[#6a7765]">Likes, comments, shares, saves</p>
            </div>
            <div className="h-[280px] px-4 pb-6">
              <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donut}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {donut.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Platform performance */}
          <Card className="rounded-2xl border border-lime-200/70 bg-white shadow-sm">
            <div className="p-5">
              <p className="text-lg font-semibold text-[#1f2a17]">Platform Performance</p>
              <p className="text-sm text-[#6a7765]">Instagram drives the majority of your reach</p>
            </div>
            <div className="h-[280px] px-4 pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platforms} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5ebdf" />
                  <XAxis dataKey="platform" tick={{ fontSize: 12, fill: "#69736b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#69736b" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4ecd9" }} />
                  <Bar dataKey="value" radius={[8, 8, 4, 4]} fill="#6BBF59" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Content performance */}
        <Card className="rounded-2xl border border-lime-200/70 bg-white shadow-sm">
          <div className="p-5">
            <p className="text-lg font-semibold text-[#1f2a17]">Content Performance</p>
            <p className="text-sm text-[#6a7765]">Video content generates 2x more engagement</p>
          </div>
          <div className="h-[260px] px-4 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={content} layout="vertical" barSize={22} margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5ebdf" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#69736b" }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 12, fill: "#69736b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4ecd9" }} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                  {content.map((entry) => (
                    <Cell
                      key={entry.type}
                      fill={entry.type === "Video" ? "#6BBF59" : entry.type === "Carousel" ? "#94D17C" : "#C4E7AA"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Key insights */}
        <Card className="rounded-2xl border border-lime-200/70 bg-white shadow-sm">
          <div className="p-5">
            <p className="text-lg font-semibold text-[#1f2a17]">Key Insights</p>
          </div>
          <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
            {insightsList.map((text, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-lime-200/70 bg-[#f7fbf3] px-4 py-3 text-sm font-semibold text-[#1f2a17] shadow-sm"
              >
                {text}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ClientDashboardShell>
  );
}
