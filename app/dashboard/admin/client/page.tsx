"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  CalendarDays,
  FileText,
  Globe2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  MessageSquare,
  MousePointer2,
  RefreshCcw,
  Save,
  Search,
  Share2,
  Sparkles,
  Upload,
  Users,
  Wallet,
  FilePlus2,
  TrendingUp,
  Clock3,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Role = "Admin" | "Analyst" | "Viewer";
type TabKey = "overview" | "analytics" | "calendar" | "reports" | "social" | "posts";
type TimeRange = "7D" | "30D" | "90D" | "6M" | "1Y";
type CalendarStatus = "Scheduled" | "Published";
type ReportCadence = "Weekly" | "Monthly";
type ExportFormat = "PDF" | "CSV";
type SocialStatus = "Connected" | "Disconnected" | "Error";
type PostContentType = "Video" | "Image" | "Carousel";
type PostStatus = "Scheduled" | "Published";

interface ClientRecord {
  id: string;
  name: string;
  industry: string;
  region: string;
  owner: string;
  status: "Active" | "At Risk" | "Paused";
}

interface NewClientForm {
  companyName: string;
  contactName: string;
  password: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  region: string;
  owner: string;
  status: ClientRecord["status"];
  projectIdentifier: string;
  notes: string;
}

interface MonthlyGrowthRow {
  label: string;
  reach: string;
  adCampaign: string;
  followerGrowth: string;
  engagements: string;
  ctr: string;
}

interface DailyGrowthRow {
  label: string;
  impressions: string;
  engagement: string;
  clicks: string;
}

interface DraftState {
  overview: {
    logoName: string;
    projectIdentifier: string;
    totalReach: string;
    watchedHours: string;
    adBudget: string;
    engagementRate: string;
    growth: MonthlyGrowthRow[];
    breakdown: {
      reach: string;
      engagement: string;
      clicks: string;
    };
    insights: string;
  };
  analytics: {
    timeRange: TimeRange;
    impressions: string;
    engagement: string;
    clicks: string;
    shares: string;
    growth: DailyGrowthRow[];
    engagementBreakdown: {
      likes: string;
      comments: string;
      shares: string;
      saves: string;
    };
    platformPerformance: {
      instagram: string;
      facebook: string;
      tiktok: string;
    };
    contentPerformance: {
      video: string;
      carousel: string;
      image: string;
    };
    exportCsv: boolean;
    exportPdf: boolean;
  };
  calendar: {
    date: string;
    platform: string;
    contentType: string;
    status: CalendarStatus;
    notes: string;
    syncGoogle: boolean;
    syncOutlook: boolean;
  };
  reports: {
    autoGenerate: boolean;
    cadence: ReportCadence;
    exportFormat: ExportFormat;
    aiSummary: string;
  };
  social: {
    platform: string;
    handle: string;
    accountId: string;
    connectionDate: string;
    followers: string;
    likes: string;
    comments: string;
    shares: string;
    posts: string;
    status: SocialStatus;
  };
  posts: {
    platform: string;
    date: string;
    contentType: PostContentType;
    status: PostStatus;
    likes: string;
    comments: string;
    shares: string;
    saves: string;
    adminNotes: string;
  };
}

interface ToastItem {
  id: string;
  tone: "success" | "info" | "error";
  message: string;
}

interface ChartDatum {
  label: string;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
}

const INITIAL_CLIENTS: ClientRecord[] = [
  { id: "northstar-retail", name: "Northstar Retail", industry: "Retail", region: "North America", owner: "Sarah Kim", status: "Active" },
  { id: "greengrid-energy", name: "GreenGrid Energy", industry: "Energy", region: "Europe", owner: "Daniel Reed", status: "At Risk" },
  { id: "atlas-health", name: "Atlas Health", industry: "Healthcare", region: "Middle East", owner: "Amina Yusuf", status: "Active" },
  { id: "mosaic-hospitality", name: "Mosaic Hospitality", industry: "Hospitality", region: "Africa", owner: "Leila Haddad", status: "Paused" },
];

const TABS: { key: TabKey; label: string; icon: typeof BarChart3 }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "analytics", label: "Analytics", icon: TrendingUp },
  { key: "calendar", label: "Marketing Calendar", icon: CalendarDays },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "social", label: "Social Accounts", icon: Globe2 },
  { key: "posts", label: "Posts", icon: FilePlus2 },
];

const TIME_RANGES: TimeRange[] = ["7D", "30D", "90D", "6M", "1Y"];
const STORAGE_PREFIX = "amolex:client-metrics:";
const CLIENTS_STORAGE_KEY = "amolex:client-directory";

function emptyMonthly(label: string): MonthlyGrowthRow {
  return { label, reach: "0", adCampaign: "0", followerGrowth: "0", engagements: "0", ctr: "0" };
}

function emptyDaily(label: string): DailyGrowthRow {
  return { label, impressions: "0", engagement: "0", clicks: "0" };
}

function defaultDraft(client: ClientRecord): DraftState {
  return {
    overview: {
      logoName: "",
      projectIdentifier: `${client.name} / Portal`,
      totalReach: "684294",
      watchedHours: "312.4",
      adBudget: "56000",
      engagementRate: "27.3",
      growth: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(emptyMonthly),
      breakdown: { reach: "48", engagement: "32", clicks: "20" },
      insights: "Video content performs best for top-funnel growth.",
    },
    analytics: {
      timeRange: "30D",
      impressions: "155800",
      engagement: "32390",
      clicks: "11990",
      shares: "2480",
      growth: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(emptyDaily),
      engagementBreakdown: { likes: "54", comments: "18", shares: "16", saves: "12" },
      platformPerformance: { instagram: "48", facebook: "27", tiktok: "25" },
      contentPerformance: { video: "56", carousel: "28", image: "16" },
      exportCsv: true,
      exportPdf: true,
    },
    calendar: {
      date: "2026-04-30",
      platform: "Instagram",
      contentType: "Video",
      status: "Scheduled",
      notes: "Launch campaign with social proof and a direct CTA.",
      syncGoogle: true,
      syncOutlook: false,
    },
    reports: {
      autoGenerate: true,
      cadence: "Weekly",
      exportFormat: "PDF",
      aiSummary: "Highlight top performing content and budget pacing in the summary.",
    },
    social: {
      platform: "Instagram",
      handle: "@amolexclient",
      accountId: "insta-001",
      connectionDate: "2026-04-01",
      followers: "94200",
      likes: "18200",
      comments: "860",
      shares: "1310",
      posts: "214",
      status: "Connected",
    },
    posts: {
      platform: "Instagram",
      date: "2026-04-30",
      contentType: "Video",
      status: "Scheduled",
      likes: "3200",
      comments: "180",
      shares: "95",
      saves: "130",
      adminNotes: "Best posting time: Tuesday 10:00 AM.",
    },
  };
}

function defaultNewClientForm(): NewClientForm {
  return {
    companyName: "",
    contactName: "",
    password: "",
    email: "",
    phone: "",
    website: "",
    industry: "Retail",
    region: "North America",
    owner: "",
    status: "Active",
    projectIdentifier: "",
    notes: "",
  };
}

function createClientId(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `client-${Date.now()}`
  );
}

function loadDraft(client: ClientRecord): DraftState {
  if (typeof window === "undefined") return defaultDraft(client);
  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${client.id}`);
  if (!raw) return defaultDraft(client);
  try {
    return JSON.parse(raw) as DraftState;
  } catch {
    return defaultDraft(client);
  }
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sum(values: string[]) {
  return values.reduce((total, value) => total + toNumber(value), 0);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-500">{children}</p>;
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">{eyebrow}</p>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="max-w-3xl text-sm leading-7 text-slate-700">{description}</p>
    </div>
  );
}

function formatHours(value: string) {
  const number = toNumber(value);
  const hours = Math.floor(number);
  const minutes = Math.round((number - hours) * 60);
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export default function AdminClientMetricsPage() {
  const [role, setRole] = useState<Role>("Admin");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [clients, setClients] = useState<ClientRecord[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState(INITIAL_CLIENTS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, DraftState>>(() =>
    Object.fromEntries(INITIAL_CLIENTS.map((client) => [client.id, defaultDraft(client)]))
  );
  const [newClientForm, setNewClientForm] = useState<NewClientForm>(() => defaultNewClientForm());
  const [mounted, setMounted] = useState(false);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? clients[0],
    [clients, selectedClientId]
  );
  const draft = drafts[selectedClient.id] ?? defaultDraft(selectedClient);
  const canEdit = role === "Admin";

  const theme = darkMode
    ? {
        shell: "bg-[#071025] text-white",
        panel: "border-blue-900/40 bg-[#0b1736] text-white",
        soft: "border-blue-900/35 bg-[#0e1b40]",
        input: "border-blue-900/50 bg-[#091226] text-white placeholder:text-blue-300",
        muted: "text-blue-200",
        strong: "text-blue-100",
      }
    : {
        shell: "bg-gradient-to-br from-[#f4f8ff] via-[#eef5ff] to-[#f8fbff] text-slate-900",
        panel: "border-blue-100 bg-white text-slate-900 shadow-[0_14px_34px_rgba(37,99,235,0.08)]",
        soft: "border-blue-100 bg-blue-50/40",
        input: "border-blue-100 bg-white text-slate-900 placeholder:text-slate-600",
        muted: "text-slate-700",
        strong: "text-slate-900",
      };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (raw) {
        const storedClients = JSON.parse(raw) as ClientRecord[];
        if (Array.isArray(storedClients) && storedClients.length > 0) {
          setClients(storedClients);
          setSelectedClientId((current) => (storedClients.some((client) => client.id === current) ? current : storedClients[0].id));
          setDrafts((prev) => {
            const next = { ...prev };
            for (const client of storedClients) {
              next[client.id] = prev[client.id] ?? loadDraft(client);
            }
            return next;
          });
        }
      }
    } catch {
      setClients(INITIAL_CLIENTS);
    } finally {
      setClientsLoaded(true);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !clientsLoaded) return;
    window.localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  }, [clients, clientsLoaded, mounted]);

  useEffect(() => {
    if (!mounted) return;
    setDrafts((prev) => ({
      ...prev,
      [selectedClient.id]: loadDraft(selectedClient),
    }));
    setLastSavedAt(window.localStorage.getItem(`${STORAGE_PREFIX}${selectedClient.id}:savedAt`));
  }, [mounted, selectedClient]);

  useEffect(() => {
    if (!mounted) return;
    setSaving(true);
    const timer = window.setTimeout(() => {
      const timestamp = new Date().toISOString();
      window.localStorage.setItem(`${STORAGE_PREFIX}${selectedClient.id}`, JSON.stringify(draft));
      window.localStorage.setItem(`${STORAGE_PREFIX}${selectedClient.id}:savedAt`, timestamp);
      setLastSavedAt(timestamp);
      setSaving(false);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft, mounted, selectedClient.id]);

  const notify = (message: string, tone: ToastItem["tone"] = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, tone, message }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), 2800);
  };

  const updateDraft = (updater: (current: DraftState) => DraftState) => {
    if (!canEdit) {
      notify("Analyst mode is view only.", "error");
      return;
    }
    setDrafts((prev) => ({
      ...prev,
      [selectedClient.id]: updater(prev[selectedClient.id] ?? defaultDraft(selectedClient)),
    }));
  };

  const updateNewClient = (key: keyof NewClientForm, value: string) => {
    if (!canEdit) {
      notify("Analyst mode is view only.", "error");
      return;
    }
    setNewClientForm((current) => ({ ...current, [key]: value }));
  };

  const overviewTotal = sum([draft.overview.breakdown.reach, draft.overview.breakdown.engagement, draft.overview.breakdown.clicks]);
  const analyticsEngagementTotal = sum([
    draft.analytics.engagementBreakdown.likes,
    draft.analytics.engagementBreakdown.comments,
    draft.analytics.engagementBreakdown.shares,
    draft.analytics.engagementBreakdown.saves,
  ]);
  const analyticsPlatformTotal = sum([
    draft.analytics.platformPerformance.instagram,
    draft.analytics.platformPerformance.facebook,
    draft.analytics.platformPerformance.tiktok,
  ]);
  const analyticsContentTotal = sum([
    draft.analytics.contentPerformance.video,
    draft.analytics.contentPerformance.carousel,
    draft.analytics.contentPerformance.image,
  ]);

  const overviewChart: ChartDatum[] = draft.overview.growth.map((row) => ({
    label: row.label,
    a: toNumber(row.reach),
    b: toNumber(row.adCampaign),
    c: toNumber(row.followerGrowth),
    d: toNumber(row.engagements),
    e: toNumber(row.ctr),
  }));

  const analyticsChart: ChartDatum[] = draft.analytics.growth.map((row) => ({
    label: row.label,
    a: toNumber(row.impressions),
    b: toNumber(row.engagement),
    c: toNumber(row.clicks),
    d: 0,
    e: 0,
  }));

  const filteredClients = clients.filter((client) =>
    [client.name, client.industry, client.region, client.owner].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canSave = overviewTotal === 100 && analyticsEngagementTotal === 100 && analyticsPlatformTotal === 100 && analyticsContentTotal === 100;

  const saveNow = () => {
    if (!canEdit) {
      notify("Analyst role cannot edit metrics.", "error");
      return;
    }
    if (!canSave) {
      notify("Percentage fields must total 100.", "error");
      return;
    }
    const timestamp = new Date().toISOString();
    window.localStorage.setItem(`${STORAGE_PREFIX}${selectedClient.id}`, JSON.stringify(draft));
    window.localStorage.setItem(`${STORAGE_PREFIX}${selectedClient.id}:savedAt`, timestamp);
    setLastSavedAt(timestamp);
    setSaving(false);
    notify("Metrics saved successfully.", "success");
  };

  const addClient = () => {
    if (!canEdit) {
      notify("Analyst role cannot add clients.", "error");
      return;
    }

    if (!newClientForm.companyName.trim() || !newClientForm.contactName.trim() || !newClientForm.password.trim()) {
      notify("Company name, contact name, and password are required.", "error");
      return;
    }

    const id = createClientId(newClientForm.companyName);
    const nextClient: ClientRecord = {
      id,
      name: newClientForm.companyName.trim(),
      industry: newClientForm.industry.trim() || "General",
      region: newClientForm.region.trim() || "North America",
      owner: newClientForm.owner.trim() || newClientForm.contactName.trim(),
      status: newClientForm.status,
    };
    const nextDraft = defaultDraft(nextClient);

    setClients((prev) => {
      const deduped = prev.filter((client) => client.id !== id);
      return [nextClient, ...deduped];
    });
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...nextDraft,
        overview: {
          ...nextDraft.overview,
          projectIdentifier: newClientForm.projectIdentifier.trim() || `${nextClient.name} / Portal`,
        },
      },
    }));
    setSelectedClientId(id);
    setActiveTab("overview");
    setNewClientForm(defaultNewClientForm());
    notify(`Client "${nextClient.name}" added successfully.`, "success");
  };

  const tabButtonClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
      active
        ? darkMode
          ? "border-blue-400 bg-blue-500/20 text-blue-100"
          : "border-blue-200 bg-blue-50 text-blue-800"
        : darkMode
          ? "border-transparent text-blue-200 hover:border-blue-800 hover:bg-blue-900/35"
          : "border-transparent text-slate-800 hover:border-blue-100 hover:bg-blue-50"
    );

  const activeGroupWarning =
    overviewTotal !== 100
      ? "Overview breakdown fields must total 100."
      : analyticsEngagementTotal !== 100
        ? "Engagement breakdown fields must total 100."
        : analyticsPlatformTotal !== 100
          ? "Platform performance fields must total 100."
          : analyticsContentTotal !== 100
            ? "Content performance fields must total 100."
            : "";

  if (!mounted) {
    return <div className={cn("min-h-screen", theme.shell)} />;
  }

  return (
    <div className={cn("min-h-screen", theme.shell)}>
      <div className="mx-auto max-w-[1700px] px-4 py-6 lg:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Amolex Client Portal</p>
            <h1 className="text-4xl font-bold text-slate-900 lg:text-5xl">Metrics Form Center</h1>
            <p className={cn("max-w-3xl text-sm leading-7", theme.muted)}>
              Enter centralized client metrics here and the same values can feed Overview, Analytics, Marketing Calendar,
              Reports, Social Accounts, and Posts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className={cn("h-11 rounded-full border px-4 text-sm font-semibold outline-none", theme.input)}
            >
              <option>Admin</option>
              <option>Analyst</option>
              <option>Viewer</option>
            </select>
            <Button variant="outline" className={cn("h-11 rounded-full border px-4", theme.panel)} onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? "Light" : "Dark"} mode
            </Button>
            <Button variant="outline" className={cn("h-11 rounded-full border px-4", theme.panel)} onClick={saveNow} disabled={!canEdit || !canSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <aside className={cn("sticky top-6 h-fit rounded-[1.75rem] border p-4", theme.panel)}>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">Registered Clients</p>
                  <p className={cn("text-sm", theme.muted)}>Select a client to load its metric drafts.</p>
                </div>
                <Badge className="border border-blue-200 bg-blue-50 text-blue-700">{role}</Badge>
              </div>
              <div className="relative">
                <Search className={cn("pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", theme.muted)} />
                <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search clients..." className={cn("pl-10", theme.input)} />
              </div>

              <div className="space-y-2">
                {filteredClients.map((client) => {
                  const active = client.id === selectedClient.id;
                  return (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={cn(
                        "w-full rounded-2xl border p-4 text-left transition",
                        active
                          ? darkMode
                            ? "border-blue-400 bg-blue-500/20"
                            : "border-blue-200 bg-blue-50"
                          : darkMode
                            ? "border-blue-900/40 bg-[#0b1736] hover:border-blue-700 hover:bg-blue-900/30"
                            : "border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={cn("truncate font-semibold", darkMode ? "text-white" : "text-slate-900")}>{client.name}</p>
                          <p className={cn("text-xs", theme.muted)}>
                            {client.industry} · {client.region}
                          </p>
                        </div>
                        <Badge className="border border-blue-200 bg-blue-50 text-[10px] text-blue-700">{client.status}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className={cn("rounded-xl border px-3 py-2", theme.soft)}>
                          <p className={cn("uppercase tracking-[0.16em]", theme.muted)}>Owner</p>
                          <p className="mt-1 font-semibold">{client.owner}</p>
                        </div>
                        <div className={cn("rounded-xl border px-3 py-2", theme.soft)}>
                          <p className={cn("uppercase tracking-[0.16em]", theme.muted)}>Workspace</p>
                          <p className="mt-1 font-semibold">Open</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <Card className={cn("rounded-[1.75rem] border p-5", theme.panel)}>
              <CardHeader className="p-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Admin Intake</p>
                    <CardTitle className="text-3xl font-semibold text-slate-900">Add Client</CardTitle>
                    <p className={cn("max-w-3xl text-sm leading-7", theme.muted)}>
                      Create a new client record here. Once saved, the client appears in the registered clients list and opens
                      in the workspace automatically.
                    </p>
                  </div>
                  <Badge className="border border-blue-200 bg-blue-50 text-blue-700">{canEdit ? "Editable" : "View Only"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <FieldLabel>Company name</FieldLabel>
                    <Input
                      value={newClientForm.companyName}
                      disabled={!canEdit}
                      className={cn(theme.input)}
                      onChange={(event) => updateNewClient("companyName", event.target.value)}
                      placeholder="Acme Holdings"
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact name</FieldLabel>
                    <Input
                      value={newClientForm.contactName}
                      disabled={!canEdit}
                      className={cn(theme.input)}
                      onChange={(event) => updateNewClient("contactName", event.target.value)}
                      placeholder="Mina Tesfaye"
                    />
                  </div>
                  <div>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      value={newClientForm.password}
                      disabled={!canEdit}
                      className={cn(theme.input)}
                      onChange={(event) => updateNewClient("password", event.target.value)}
                      placeholder="Enter secure password"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      value={newClientForm.email}
                      disabled={!canEdit}
                      className={cn(theme.input)}
                      onChange={(event) => updateNewClient("email", event.target.value)}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <FieldLabel>Phone</FieldLabel>
                    <Input
                      value={newClientForm.phone}
                      disabled={!canEdit}
                      className={cn(theme.input)}
                      onChange={(event) => updateNewClient("phone", event.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <FieldLabel>Website</FieldLabel>
                    <Input
                      value={newClientForm.website}
                      disabled={!canEdit}
                      className={cn(theme.input)}
                      onChange={(event) => updateNewClient("website", event.target.value)}
                      placeholder="https://company.com"
                    />
                  </div>
                  <div>
                    <FieldLabel>Industry</FieldLabel>
                    <select
                      value={newClientForm.industry}
                      disabled={!canEdit}
                      className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                      onChange={(event) => updateNewClient("industry", event.target.value)}
                    >
                      <option>Retail</option>
                      <option>Healthcare</option>
                      <option>Energy</option>
                      <option>Hospitality</option>
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Region</FieldLabel>
                    <select
                      value={newClientForm.region}
                      disabled={!canEdit}
                      className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                      onChange={(event) => updateNewClient("region", event.target.value)}
                    >
                      <option>North America</option>
                      <option>Europe</option>
                      <option>Middle East</option>
                      <option>Africa</option>
                      <option>Asia Pacific</option>
                      <option>South America</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Owner</FieldLabel>
                    <Input
                      value={newClientForm.owner}
                      disabled={!canEdit}
                      className={cn(theme.input)}
                      onChange={(event) => updateNewClient("owner", event.target.value)}
                      placeholder="Account manager"
                    />
                  </div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <select
                      value={newClientForm.status}
                      disabled={!canEdit}
                      className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                      onChange={(event) => updateNewClient("status", event.target.value)}
                    >
                      <option>Active</option>
                      <option>At Risk</option>
                      <option>Paused</option>
                    </select>
                  </div>
                  <div className="xl:col-span-3">
                    <FieldLabel>Project identifier</FieldLabel>
                    <Input
                      value={newClientForm.projectIdentifier}
                      disabled={!canEdit}
                      className={cn(theme.input)}
                      onChange={(event) => updateNewClient("projectIdentifier", event.target.value)}
                      placeholder="Client / Portal"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Admin setup notes</FieldLabel>
                  <Textarea
                    value={newClientForm.notes}
                    disabled={!canEdit}
                    className={cn(theme.input, "min-h-[140px]")}
                    onChange={(event) => updateNewClient("notes", event.target.value)}
                    placeholder="Add onboarding notes, permissions, launch requirements, and special requests."
                  />
                </div>

                <div className={cn("flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4", theme.soft)}>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Ready to create the client record?</p>
                    <p className={cn("text-sm", theme.muted)}>
                      The new client will be added to the registered list, selected automatically, and get a fresh metrics draft.
                    </p>
                  </div>
                  <Button className="rounded-full bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700" onClick={addClient} disabled={!canEdit}>
                    Add Client
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={cn("rounded-[1.75rem] border p-5", theme.panel)}>
              <CardHeader className="p-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Drafting For</p>
                      <Badge className="border border-blue-200 bg-blue-50 text-blue-700">{selectedClient.industry}</Badge>
                      <Badge className="border border-blue-200 bg-blue-50 text-blue-700">{selectedClient.region}</Badge>
                    </div>
                    <CardTitle className="text-3xl font-semibold text-slate-900">{selectedClient.name}</CardTitle>
                    <p className={cn("text-sm leading-7", theme.muted)}>
                      Change any metric in the tabs below. Auto-save keeps the draft locally, and the same data can later feed other portal sections.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border border-blue-200 bg-blue-50 text-blue-700">Auto-save {saving ? "on" : "idle"}</Badge>
                    <Badge className="border border-blue-200 bg-blue-50 text-blue-700">
                      {lastSavedAt ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}` : "No saved draft yet"}
                    </Badge>
                    <Badge className="border border-blue-200 bg-blue-50 text-blue-700">{canEdit ? "Editable" : "View Only"}</Badge>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-blue-100 pt-4">
                  {TABS.map((tab) => {
                    const active = activeTab === tab.key;
                    const Icon = tab.icon;
                    return (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={tabButtonClass(active)}>
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </CardHeader>
            </Card>

            {activeTab === "overview" ? (
              <div className="space-y-6">
                <SectionTitle
                  eyebrow="Overview Metrics"
                  title="Core performance inputs"
                  description="Enter the overall client performance metrics and a monthly growth snapshot that powers the overview dashboard."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Total Reach", icon: BarChart3, value: draft.overview.totalReach, key: "totalReach" as const },
                    { label: "Watched Hours", icon: Clock3, value: draft.overview.watchedHours, key: "watchedHours" as const },
                    { label: "Ad Spend / Budget", icon: Wallet, value: draft.overview.adBudget, key: "adBudget" as const },
                    { label: "Engagement Rate", icon: Target, value: draft.overview.engagementRate, key: "engagementRate" as const },
                  ].map((field) => {
                    const Icon = field.icon;
                    return (
                      <Card key={field.label} className={cn("rounded-[1.5rem] border", theme.panel)}>
                        <CardContent className="p-5">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">{field.label}</p>
                            <Icon className="h-4 w-4 text-blue-500" />
                          </div>
                          <Input
                            value={field.value}
                            type="number"
                            disabled={!canEdit}
                            className={cn(theme.input)}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                overview: { ...current.overview, [field.key]: event.target.value },
                              }))
                            }
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-900">Brand Identifier</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <FieldLabel>Logo / Project ID</FieldLabel>
                        <Input
                          value={draft.overview.projectIdentifier}
                          disabled={!canEdit}
                          className={cn(theme.input)}
                          onChange={(event) =>
                            updateDraft((current) => ({
                              ...current,
                              overview: { ...current.overview, projectIdentifier: event.target.value },
                            }))
                          }
                        />
                      </div>

                      <div>
                        <FieldLabel>Upload Logo</FieldLabel>
                        <label className={cn("flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3", theme.soft)}>
                          <Upload className="h-4 w-4 text-blue-500" />
                          <span className={cn("text-sm", theme.strong)}>{draft.overview.logoName || "Choose a logo image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={!canEdit}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              updateDraft((current) => ({
                                ...current,
                                overview: { ...current.overview, logoName: file.name },
                              }));
                              notify(`Logo "${file.name}" attached.`, "success");
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <FieldLabel>Insights</FieldLabel>
                        <Textarea
                          value={draft.overview.insights}
                          disabled={!canEdit}
                          className={cn(theme.input, "min-h-[160px]")}
                          onChange={(event) =>
                            updateDraft((current) => ({
                              ...current,
                              overview: { ...current.overview, insights: event.target.value },
                            }))
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-900">Performance Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: "Reach %", key: "reach" as const, value: draft.overview.breakdown.reach },
                        { label: "Engagement %", key: "engagement" as const, value: draft.overview.breakdown.engagement },
                        { label: "Clicks %", key: "clicks" as const, value: draft.overview.breakdown.clicks },
                      ].map((field) => (
                        <div key={field.label}>
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                            <p className={cn("text-xs font-semibold", overviewTotal === 100 ? "text-emerald-600" : "text-rose-500")}>
                              Total: {overviewTotal}%
                            </p>
                          </div>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            className={cn(theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                overview: {
                                  ...current.overview,
                                  breakdown: { ...current.overview.breakdown, [field.key]: event.target.value },
                                },
                              }))
                            }
                          />
                        </div>
                      ))}

                      <div className={cn("rounded-2xl border border-blue-100 bg-blue-50/50 p-4", theme.soft)}>
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                          <LineChartIcon className="h-4 w-4" />
                          Monthly Growth Preview
                        </div>
                        <div className="h-[240px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={overviewChart}>
                              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1d4ed8" : "#dbeafe"} />
                              <XAxis dataKey="label" stroke={darkMode ? "#bfdbfe" : "#2563eb"} />
                              <YAxis stroke={darkMode ? "#bfdbfe" : "#2563eb"} />
                              <Tooltip />
                              <Line dataKey="a" stroke="#2563eb" strokeWidth={3} dot={false} />
                              <Line dataKey="b" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                              <Line dataKey="c" stroke="#7c3aed" strokeWidth={3} dot={false} />
                              <Line dataKey="d" stroke="#16a34a" strokeWidth={3} dot={false} />
                              <Line dataKey="e" stroke="#f59e0b" strokeWidth={3} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-blue-100 bg-white p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                          <PieChartIcon className="h-4 w-4" />
                          Performance Breakdown Preview
                        </div>
                        <div className="h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Reach", value: toNumber(draft.overview.breakdown.reach) },
                                  { name: "Engagement", value: toNumber(draft.overview.breakdown.engagement) },
                                  { name: "Clicks", value: toNumber(draft.overview.breakdown.clicks) },
                                ]}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={48}
                                outerRadius={84}
                                label
                              >
                                {["#2563eb", "#0ea5e9", "#7c3aed"].map((color) => (
                                  <Cell key={color} fill={color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">Monthly Growth Inputs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 xl:grid-cols-[1fr_repeat(5,minmax(0,1fr))]">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">Month</div>
                      {["Reach", "Ad Campaign", "Follower Growth", "Engagements", "CTR"].map((label) => (
                        <div key={label} className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
                          {label}
                        </div>
                      ))}
                    </div>
                    {draft.overview.growth.map((row, index) => (
                      <div key={row.label} className="grid gap-3 xl:grid-cols-[1fr_repeat(5,minmax(0,1fr))]">
                        <div className={cn("rounded-2xl border px-4 py-3 font-semibold", theme.soft)}>{row.label}</div>
                        {(["reach", "adCampaign", "followerGrowth", "engagements", "ctr"] as const).map((key) => (
                          <Input
                            key={key}
                            type="number"
                            disabled={!canEdit}
                            className={cn(theme.input)}
                            value={row[key]}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                overview: {
                                  ...current.overview,
                                  growth: current.overview.growth.map((item, itemIndex) =>
                                    itemIndex === index ? { ...item, [key]: event.target.value } : item
                                  ),
                                },
                              }))
                            }
                          />
                        ))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : activeTab === "analytics" ? (
              <div className="space-y-6">
                <SectionTitle
                  eyebrow="Analytics Metrics"
                  title="Trend and channel inputs"
                  description="Capture the performance values used in reporting, trend charts, and AI-driven insight summaries."
                />

                <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Time Range</p>
                      <p className={cn("text-sm", theme.muted)}>Choose the reporting window for this analytics draft.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TIME_RANGES.map((range) => {
                        const active = draft.analytics.timeRange === range;
                        return (
                          <button
                            key={range}
                            onClick={() => updateDraft((current) => ({ ...current, analytics: { ...current.analytics, timeRange: range } }))}
                            className={tabButtonClass(active)}
                          >
                            {range}
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Impressions", value: draft.analytics.impressions, key: "impressions" as const, icon: BarChart3 },
                    { label: "Engagement %", value: draft.analytics.engagement, key: "engagement" as const, icon: MessageSquare },
                    { label: "Clicks", value: draft.analytics.clicks, key: "clicks" as const, icon: MousePointer2 },
                    { label: "Shares", value: draft.analytics.shares, key: "shares" as const, icon: Share2 },
                  ].map((field) => {
                    const Icon = field.icon;
                    return (
                      <Card key={field.label} className={cn("rounded-[1.5rem] border", theme.panel)}>
                        <CardContent className="p-5">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">{field.label}</p>
                            <Icon className="h-4 w-4 text-blue-500" />
                          </div>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            className={cn(theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                analytics: { ...current.analytics, [field.key]: event.target.value },
                              }))
                            }
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-900">Daily Growth Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-3 xl:grid-cols-[1fr_repeat(3,minmax(0,1fr))]">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">Day</div>
                        {["Impressions", "Engagement", "Clicks"].map((label) => (
                          <div key={label} className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
                            {label}
                          </div>
                        ))}
                      </div>
                      {draft.analytics.growth.map((row, index) => (
                        <div key={row.label} className="grid gap-3 xl:grid-cols-[1fr_repeat(3,minmax(0,1fr))]">
                          <div className={cn("rounded-2xl border px-4 py-3 font-semibold", theme.soft)}>{row.label}</div>
                          {(["impressions", "engagement", "clicks"] as const).map((key) => (
                            <Input
                              key={key}
                              type="number"
                              disabled={!canEdit}
                              className={cn(theme.input)}
                              value={row[key]}
                              onChange={(event) =>
                                updateDraft((current) => ({
                                  ...current,
                                  analytics: {
                                    ...current.analytics,
                                    growth: current.analytics.growth.map((item, itemIndex) =>
                                      itemIndex === index ? { ...item, [key]: event.target.value } : item
                                    ),
                                  },
                                }))
                              }
                            />
                          ))}
                        </div>
                      ))}
                      <div className="h-[240px] rounded-2xl border border-blue-100 bg-white p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analyticsChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1d4ed8" : "#dbeafe"} />
                            <XAxis dataKey="label" stroke={darkMode ? "#bfdbfe" : "#2563eb"} />
                            <YAxis stroke={darkMode ? "#bfdbfe" : "#2563eb"} />
                            <Tooltip />
                            <Line dataKey="a" stroke="#2563eb" strokeWidth={3} dot={false} />
                            <Line dataKey="b" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                            <Line dataKey="c" stroke="#7c3aed" strokeWidth={3} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-900">Breakdowns and Export</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: "Likes", key: "likes" as const, value: draft.analytics.engagementBreakdown.likes },
                        { label: "Comments", key: "comments" as const, value: draft.analytics.engagementBreakdown.comments },
                        { label: "Shares", key: "shares" as const, value: draft.analytics.engagementBreakdown.shares },
                        { label: "Saves", key: "saves" as const, value: draft.analytics.engagementBreakdown.saves },
                      ].map((field) => (
                        <div key={field.label}>
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                            <span className={cn("text-xs font-semibold", analyticsEngagementTotal === 100 ? "text-emerald-600" : "text-rose-500")}>
                              Total: {analyticsEngagementTotal}%
                            </span>
                          </div>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            className={cn(theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                analytics: {
                                  ...current.analytics,
                                  engagementBreakdown: { ...current.analytics.engagementBreakdown, [field.key]: event.target.value },
                                },
                              }))
                            }
                          />
                        </div>
                      ))}

                      <div className="grid gap-3 md:grid-cols-2">
                        {[
                          { label: "Instagram", key: "instagram" as const, value: draft.analytics.platformPerformance.instagram },
                          { label: "Facebook", key: "facebook" as const, value: draft.analytics.platformPerformance.facebook },
                          { label: "TikTok", key: "tiktok" as const, value: draft.analytics.platformPerformance.tiktok },
                        ].map((field) => (
                          <div key={field.label}>
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                              <span className={cn("text-xs font-semibold", analyticsPlatformTotal === 100 ? "text-emerald-600" : "text-rose-500")}>
                                Total: {analyticsPlatformTotal}%
                              </span>
                            </div>
                            <Input
                              type="number"
                              disabled={!canEdit}
                              className={cn(theme.input)}
                              value={field.value}
                              onChange={(event) =>
                                updateDraft((current) => ({
                                  ...current,
                                  analytics: {
                                    ...current.analytics,
                                    platformPerformance: { ...current.analytics.platformPerformance, [field.key]: event.target.value },
                                  },
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        {[
                          { label: "Video", key: "video" as const, value: draft.analytics.contentPerformance.video },
                          { label: "Carousel", key: "carousel" as const, value: draft.analytics.contentPerformance.carousel },
                          { label: "Image", key: "image" as const, value: draft.analytics.contentPerformance.image },
                        ].map((field) => (
                          <div key={field.label}>
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                              <span className={cn("text-xs font-semibold", analyticsContentTotal === 100 ? "text-emerald-600" : "text-rose-500")}>
                                Total: {analyticsContentTotal}%
                              </span>
                            </div>
                            <Input
                              type="number"
                              disabled={!canEdit}
                              className={cn(theme.input)}
                              value={field.value}
                              onChange={(event) =>
                                updateDraft((current) => ({
                                  ...current,
                                  analytics: {
                                    ...current.analytics,
                                    contentPerformance: { ...current.analytics.contentPerformance, [field.key]: event.target.value },
                                  },
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                        <p className="mb-3 text-sm font-semibold text-blue-700">Export Toggle</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {[
                            { label: "CSV export", key: "exportCsv" as const, value: draft.analytics.exportCsv },
                            { label: "PDF export", key: "exportPdf" as const, value: draft.analytics.exportPdf },
                          ].map((item) => (
                            <label key={item.label} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                disabled={!canEdit}
                                checked={item.value}
                                onChange={(event) =>
                                  updateDraft((current) => ({
                                    ...current,
                                    analytics: { ...current.analytics, [item.key]: event.target.checked },
                                  }))
                                }
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-blue-100 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                          <Sparkles className="h-4 w-4" />
                          AI Insight Preview
                        </div>
                        <p className={cn("mt-3 text-sm leading-7", theme.strong)}>
                          The analytics form can be piped into OpenAI-generated summaries once the backend is connected.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : activeTab === "calendar" ? (
              <div className="space-y-6">
                <SectionTitle
                  eyebrow="Marketing Calendar"
                  title="Campaign scheduler"
                  description="Set campaign date, platform, content type, status, and sync preferences."
                />
                <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                  <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <FieldLabel>Campaign date</FieldLabel>
                      <Input
                        type="date"
                        disabled={!canEdit}
                        className={cn(theme.input)}
                        value={draft.calendar.date}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, calendar: { ...current.calendar, date: event.target.value } }))
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Platform</FieldLabel>
                      <select
                        disabled={!canEdit}
                        className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                        value={draft.calendar.platform}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, calendar: { ...current.calendar, platform: event.target.value } }))
                        }
                      >
                        <option>Instagram</option>
                        <option>Facebook</option>
                        <option>TikTok</option>
                        <option>LinkedIn</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Content type</FieldLabel>
                      <select
                        disabled={!canEdit}
                        className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                        value={draft.calendar.contentType}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, calendar: { ...current.calendar, contentType: event.target.value } }))
                        }
                      >
                        <option>Video</option>
                        <option>Image</option>
                        <option>Carousel</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Status</FieldLabel>
                      <select
                        disabled={!canEdit}
                        className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                        value={draft.calendar.status}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, calendar: { ...current.calendar, status: event.target.value as CalendarStatus } }))
                        }
                      >
                        <option>Scheduled</option>
                        <option>Published</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 xl:col-span-3">
                      <FieldLabel>Notes</FieldLabel>
                      <Textarea
                        disabled={!canEdit}
                        className={cn(theme.input)}
                        value={draft.calendar.notes}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, calendar: { ...current.calendar, notes: event.target.value } }))
                        }
                      />
                    </div>
                    <div className="flex flex-wrap gap-4 md:col-span-2 xl:col-span-3">
                      {[
                        { label: "Google Calendar", key: "syncGoogle" as const, value: draft.calendar.syncGoogle },
                        { label: "Outlook", key: "syncOutlook" as const, value: draft.calendar.syncOutlook },
                      ].map((item) => (
                        <label key={item.label} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            disabled={!canEdit}
                            checked={item.value}
                            onChange={(event) =>
                              updateDraft((current) => ({ ...current, calendar: { ...current.calendar, [item.key]: event.target.checked } }))
                            }
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : activeTab === "reports" ? (
              <div className="space-y-6">
                <SectionTitle
                  eyebrow="Reports"
                  title="Reporting preferences"
                  description="Configure scheduled outputs, export format, and the AI summary notes used in reporting."
                />
                <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                  <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
                    <label className="flex items-center gap-2 md:col-span-2 xl:col-span-4">
                      <input
                        type="checkbox"
                        disabled={!canEdit}
                        checked={draft.reports.autoGenerate}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, reports: { ...current.reports, autoGenerate: event.target.checked } }))
                        }
                      />
                      Auto-generate reports
                    </label>
                    <div>
                      <FieldLabel>Cadence</FieldLabel>
                      <select
                        disabled={!canEdit}
                        className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                        value={draft.reports.cadence}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, reports: { ...current.reports, cadence: event.target.value as ReportCadence } }))
                        }
                      >
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Export format</FieldLabel>
                      <select
                        disabled={!canEdit}
                        className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                        value={draft.reports.exportFormat}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, reports: { ...current.reports, exportFormat: event.target.value as ExportFormat } }))
                        }
                      >
                        <option>PDF</option>
                        <option>CSV</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 xl:col-span-4">
                      <FieldLabel>AI summary notes</FieldLabel>
                      <Textarea
                        disabled={!canEdit}
                        className={cn(theme.input)}
                        value={draft.reports.aiSummary}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, reports: { ...current.reports, aiSummary: event.target.value } }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : activeTab === "social" ? (
              <div className="space-y-6">
                <SectionTitle
                  eyebrow="Social Accounts"
                  title="Account connection details"
                  description="Add or update connected social accounts and their audience statistics."
                />
                <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                  <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      { label: "Platform", key: "platform" as const, value: draft.social.platform, type: "select" },
                      { label: "Handle", key: "handle" as const, value: draft.social.handle, type: "input" },
                      { label: "Account ID", key: "accountId" as const, value: draft.social.accountId, type: "input" },
                      { label: "Connection date", key: "connectionDate" as const, value: draft.social.connectionDate, type: "date" },
                      { label: "Status", key: "status" as const, value: draft.social.status, type: "select" },
                    ].map((field) => (
                      <div key={field.label}>
                        <FieldLabel>{field.label}</FieldLabel>
                        {field.type === "select" && field.key === "platform" ? (
                          <select
                            disabled={!canEdit}
                            className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({ ...current, social: { ...current.social, platform: event.target.value } }))
                            }
                          >
                            <option>Instagram</option>
                            <option>Facebook</option>
                            <option>LinkedIn</option>
                            <option>X</option>
                          </select>
                        ) : field.type === "select" ? (
                          <select
                            disabled={!canEdit}
                            className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                social: { ...current.social, status: event.target.value as SocialStatus },
                              }))
                            }
                          >
                            <option>Connected</option>
                            <option>Disconnected</option>
                            <option>Error</option>
                          </select>
                        ) : (
                          <Input
                            type={field.type === "date" ? "date" : "text"}
                            disabled={!canEdit}
                            className={cn(theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                social: { ...current.social, [field.key]: event.target.value },
                              }))
                            }
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {[
                    { label: "Followers", key: "followers" as const, value: draft.social.followers },
                    { label: "Likes", key: "likes" as const, value: draft.social.likes },
                    { label: "Comments", key: "comments" as const, value: draft.social.comments },
                    { label: "Shares", key: "shares" as const, value: draft.social.shares },
                    { label: "Posts", key: "posts" as const, value: draft.social.posts },
                  ].map((field) => (
                    <Card key={field.label} className={cn("rounded-[1.5rem] border", theme.panel)}>
                      <CardContent className="p-5">
                        <FieldLabel>{field.label}</FieldLabel>
                        <Input
                          type="number"
                          disabled={!canEdit}
                          className={cn(theme.input)}
                          value={field.value}
                          onChange={(event) =>
                            updateDraft((current) => ({
                              ...current,
                              social: { ...current.social, [field.key]: event.target.value },
                            }))
                          }
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <SectionTitle
                  eyebrow="Posts"
                  title="Post entry form"
                  description="Enter the content type, status, engagement metrics, and admin notes for scheduled or published posts."
                />
                <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                  <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      { label: "Platform", key: "platform" as const, value: draft.posts.platform, type: "select" },
                      { label: "Date", key: "date" as const, value: draft.posts.date, type: "date" },
                      { label: "Content type", key: "contentType" as const, value: draft.posts.contentType, type: "select" },
                      { label: "Status", key: "status" as const, value: draft.posts.status, type: "select" },
                      { label: "Likes", key: "likes" as const, value: draft.posts.likes, type: "number" },
                      { label: "Comments", key: "comments" as const, value: draft.posts.comments, type: "number" },
                      { label: "Shares", key: "shares" as const, value: draft.posts.shares, type: "number" },
                      { label: "Saves", key: "saves" as const, value: draft.posts.saves, type: "number" },
                    ].map((field) => (
                      <div key={field.label}>
                        <FieldLabel>{field.label}</FieldLabel>
                        {field.type === "select" && field.key === "platform" ? (
                          <select
                            disabled={!canEdit}
                            className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({ ...current, posts: { ...current.posts, platform: event.target.value } }))
                            }
                          >
                            <option>Instagram</option>
                            <option>Facebook</option>
                            <option>LinkedIn</option>
                            <option>X</option>
                          </select>
                        ) : field.type === "select" && field.key === "contentType" ? (
                          <select
                            disabled={!canEdit}
                            className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                posts: { ...current.posts, contentType: event.target.value as PostContentType },
                              }))
                            }
                          >
                            <option>Video</option>
                            <option>Image</option>
                            <option>Carousel</option>
                          </select>
                        ) : field.type === "select" ? (
                          <select
                            disabled={!canEdit}
                            className={cn("h-11 w-full rounded-2xl border px-4 text-sm outline-none", theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                posts: { ...current.posts, status: event.target.value as PostStatus },
                              }))
                            }
                          >
                            <option>Scheduled</option>
                            <option>Published</option>
                          </select>
                        ) : (
                          <Input
                            type={field.type}
                            disabled={!canEdit}
                            className={cn(theme.input)}
                            value={field.value}
                            onChange={(event) =>
                              updateDraft((current) => ({
                                ...current,
                                posts: { ...current.posts, [field.key]: event.target.value },
                              }))
                            }
                          />
                        )}
                      </div>
                    ))}

                    <div className="md:col-span-2 xl:col-span-3">
                      <FieldLabel>Admin notes</FieldLabel>
                      <Textarea
                        disabled={!canEdit}
                        className={cn(theme.input)}
                        value={draft.posts.adminNotes}
                        onChange={(event) =>
                          updateDraft((current) => ({ ...current, posts: { ...current.posts, adminNotes: event.target.value } }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid gap-6 xl:grid-cols-2">
              <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Insights Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className={cn("rounded-2xl border p-4", theme.soft)}>
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 text-blue-500" />
                      <p className={cn("text-sm leading-7", theme.strong)}>
                        The current draft can be used to auto-generate AI insights for the overview and reporting sections.
                      </p>
                    </div>
                  </div>
                  <div className={cn("rounded-2xl border p-4", theme.soft)}>
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 text-blue-500" />
                      <p className={cn("text-sm leading-7", theme.strong)}>
                        Validation keeps percentage-based inputs aligned so charts and breakdowns remain accurate.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn("rounded-[1.75rem] border", theme.panel)}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className={cn("w-full border", theme.panel)} onClick={saveNow} disabled={!canEdit || !canSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button variant="outline" className={cn("w-full border", theme.panel)} onClick={() => notify("Draft reloaded from the browser cache.", "info")}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reload Draft
                  </Button>
                  <div className={cn("rounded-2xl border p-4 text-sm", theme.soft)}>
                    <p className="font-semibold text-slate-900">Role Access</p>
                    <p className={cn("mt-2 leading-7", theme.strong)}>
                      Admin can edit and save metrics. Analyst is view only. Viewer receives a locked preview.
                    </p>
                  </div>
                  {activeGroupWarning && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {activeGroupWarning}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "w-[320px] rounded-2xl border px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur-md",
              toast.tone === "success"
                ? "border-blue-200 bg-blue-50 text-blue-800"
                : toast.tone === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-blue-100 bg-white text-slate-900"
            )}
          >
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
