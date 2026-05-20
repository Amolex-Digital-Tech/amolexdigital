"use client";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, TrendingDown, Eye, Heart, Share2, MousePointer, Calendar } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const SAMPLE_DATA = {
  impressions: [
    { date: "Jan", value: 1200 },
    { date: "Feb", value: 1800 },
    { date: "Mar", value: 2400 },
    { date: "Apr", value: 3200 },
    { date: "May", value: 2800 },
    { date: "Jun", value: 4100 }
  ],
  engagement: [
    { date: "Jan", likes: 400, shares: 200, clicks: 150 },
    { date: "Feb", likes: 600, shares: 300, clicks: 220 },
    { date: "Mar", likes: 800, shares: 450, clicks: 380 },
    { date: "Apr", likes: 1200, shares: 600, clicks: 520 },
    { date: "May", likes: 900, shares: 400, clicks: 340 },
    { date: "Jun", likes: 1500, shares: 800, clicks: 680 }
  ],
  platform: [
    { name: "Instagram", value: 45 },
    { name: "Facebook", value: 30 },
    { name: "Twitter", value: 15 },
    { name: "LinkedIn", value: 10 }
  ],
  contentType: [
    { name: "Images", value: 55 },
    { name: "Videos", value: 30 },
    { name: "Links", value: 15 }
  ]
};

type TimeRange = "7d" | "30d" | "90d" | "1y";

export default function ClientAnalyticsDemoPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const data = SAMPLE_DATA;
  const tenantName = "Demo Workspace";

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const metrics = [
    { label: "Total Impressions", value: "17,000", change: "+12.5%", trend: "up", icon: Eye },
    { label: "Total Engagement", value: "8,500", change: "+8.2%", trend: "up", icon: Heart },
    { label: "Total Clicks", value: "2,290", change: "+15.3%", trend: "up", icon: MousePointer },
    { label: "Total Shares", value: "2,650", change: "-2.1%", trend: "down", icon: Share2 }
  ];

  return (
    <ClientDashboardShell
      title="Analytics (Demo)"
      description="Interactive visualizations of your social media performance."
    >
      <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-800">
        This is a demo showing sample data. Connect to Supabase to see real data.
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1">
          {(["7d", "30d", "90d", "1y"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "1 Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isUp = metric.trend === "up";
          return (
            <Card key={metric.label} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="mt-1 text-3xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    isUp ? "bg-green-100" : "bg-red-100"
                  }`}>
                    <Icon className={`h-6 w-6 ${isUp ? "text-green-600" : "text-red-600"}`} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {isUp ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${isUp ? "text-green-600" : "text-red-600"}`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Impressions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.impressions}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={formatNumber} />
                  <Tooltip 
                    formatter={(value: any) => [formatNumber(value), "Impressions"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0088FE" 
                    fillOpacity={1} 
                    fill="url(#colorImpressions)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.engagement}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Bar dataKey="likes" fill="#0088FE" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shares" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clicks" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.platform}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.platform.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, "Share"]} contentStyle={{ borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Content Type Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.contentType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.contentType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, "Performance"]} contentStyle={{ borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.impressions}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={formatNumber} />
                  <Tooltip formatter={(value: any) => [formatNumber(value), "Impressions"]} contentStyle={{ borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ fill: "#8884d8" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardShell>
  );
}