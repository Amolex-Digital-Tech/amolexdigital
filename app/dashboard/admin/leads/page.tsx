"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Filter,
  Flame,
  LayoutDashboard,
  Loader2,
  Menu,
  MessageSquare,
  Mic,
  MicOff,
  Plus,
  Search,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AGENT_OPTIONS,
  buildSeedLeads,
  createLeadFromForm,
  type Lead,
  type LeadNote,
  type LeadStatus,
  type NewLeadFormValues,
  type TimelineEvent,
  type TimelineType,
  loadLeadsFromStorage,
  saveLeadsToStorage,
  REGION_OPTIONS,
  SOURCE_OPTIONS,
  INTEREST_OPTIONS,
} from "@/lib/lead-store";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | LeadStatus;
type Role = "Admin" | "Sales" | "Viewer";
type SortKey = "name" | "status" | "lastActivityAt" | "assignedAgent";
type SortDirection = "asc" | "desc";

type ToastType = "success" | "error" | "info";
type Section = "leads" | "client-reports" | "team-tasks";

interface SummaryMetric {
  key: "total" | "new" | "followUps" | "conversion";
  title: string;
  value: string;
  delta: number;
}

interface AdvancedFilterState {
  dateRange: "all" | "7d" | "30d" | "90d";
  sources: string[];
  regions: string[];
  agents: string[];
}

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface HoverPreview {
  lead: Lead;
  x: number;
  y: number;
}

function createEmptyLeadForm(): NewLeadFormValues {
  const now = new Date();
  const isoLocal = now.toISOString().slice(0, 16);

  return {
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "warm",
    source: SOURCE_OPTIONS[0],
    region: REGION_OPTIONS[0],
    assignedAgent: AGENT_OPTIONS[0],
    interest: INTEREST_OPTIONS[0],
    score: "",
    engagementScore: "",
    contactPreference: "email",
    createdAt: isoLocal,
    lastActivityAt: isoLocal,
    noteAuthor: "",
    noteContent: "",
    followUpType: "call",
    followUpTitle: "",
    followUpNote: "",
    followUpBy: "",
    followUpAt: isoLocal,
  };
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const STATUS_FILTERS: FilterStatus[] = ["all", "hot", "warm", "cold", "archived"];
const PAGE_SIZE = 12;

const sidebarLinks = [{ key: "leads" as Section, label: "Leads", icon: Users }];

const footerLinks = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Messages", icon: MessageSquare },
  { label: "Calendar", icon: CalendarDays },
];

const SEED_LEADS: Lead[] = buildSeedLeads();

function formatSince(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function statusTone(status: LeadStatus): string {
  if (status === "hot") return "bg-red-100 text-red-800 border-red-300 font-semibold";
  if (status === "warm") return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
  if (status === "cold") return "bg-sky-100 text-sky-800 border-sky-300 font-semibold";
  return "bg-slate-200 text-slate-800 border-slate-300 font-semibold";
}

function engagementTag(lead: Lead): "High Intent" | "Nurture" | "Re-Engage" {
  const idleHours = (Date.now() - new Date(lead.lastActivityAt).getTime()) / 3_600_000;
  if (lead.engagementScore >= 82 && idleHours <= 72) return "High Intent";
  if (lead.engagementScore >= 65) return "Nurture";
  return "Re-Engage";
}

function trendFrom(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function computeSummary(leads: Lead[]): SummaryMetric[] {
  const now = Date.now();
  const week = 7 * 86_400_000;

  const activeLeads = leads.filter((lead) => lead.status !== "archived");
  const totalCurrent = activeLeads.length;
  const totalPrevious = Math.max(1, leads.filter((lead) => new Date(lead.createdAt).getTime() < now - week).length);

  const newCurrent = leads.filter((lead) => new Date(lead.createdAt).getTime() >= now - week).length;
  const newPrevious = leads.filter((lead) => {
    const createdAt = new Date(lead.createdAt).getTime();
    return createdAt >= now - week * 2 && createdAt < now - week;
  }).length;

  const followUpsCurrent = activeLeads.filter(
    (lead) => (now - new Date(lead.lastActivityAt).getTime()) / 86_400_000 >= 3
  ).length;
  const followUpsPrevious = Math.max(1, Math.round(followUpsCurrent * 0.88));

  const conversionCurrent = Number(
    ((activeLeads.filter((lead) => lead.status === "hot").length / Math.max(1, activeLeads.length)) * 100).toFixed(1)
  );
  const conversionPrevious = Number(Math.max(0.1, conversionCurrent - 1.9).toFixed(1));

  return [
    {
      key: "total",
      title: "Total Leads",
      value: totalCurrent.toLocaleString(),
      delta: trendFrom(totalCurrent, totalPrevious),
    },
    {
      key: "new",
      title: "New Leads",
      value: newCurrent.toLocaleString(),
      delta: trendFrom(newCurrent, newPrevious),
    },
    {
      key: "followUps",
      title: "Follow Ups",
      value: followUpsCurrent.toLocaleString(),
      delta: trendFrom(followUpsCurrent, followUpsPrevious),
    },
    {
      key: "conversion",
      title: "Conversion Rate",
      value: `${conversionCurrent}%`,
      delta: trendFrom(conversionCurrent, conversionPrevious),
    },
  ];
}

function csvEscape(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function suggestionForLead(lead: Lead): string {
  const idleDays = (Date.now() - new Date(lead.lastActivityAt).getTime()) / 86_400_000;
  if (lead.status === "hot" && idleDays < 2) {
    return "Schedule a decision-focused call within 24 hours and include implementation timeline + ROI highlights.";
  }
  if (lead.status === "warm") {
    return "Send a personalized case study matching their region and follow up with a 15-minute Q&A meeting.";
  }
  if (lead.status === "cold") {
    return "Trigger a re-engagement sequence: short value email, social proof, then one reminder after 3 days.";
  }
  return "Keep this lead in archived nurture automation with a monthly product update digest.";
}

export default function LeadGenerationPage() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState<Role>("Admin");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("leads");

  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [summary, setSummary] = useState<SummaryMetric[]>(computeSummary(SEED_LEADS));
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [leadForm, setLeadForm] = useState<NewLeadFormValues>(createEmptyLeadForm());

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    dateRange: "all",
    sources: [],
    regions: [],
    agents: [],
  });

  const [sortKey, setSortKey] = useState<SortKey>("lastActivityAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [hoverPreview, setHoverPreview] = useState<HoverPreview | null>(null);

  const [noteDraft, setNoteDraft] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const suggestionsOpenRef = useRef<HTMLDivElement | null>(null);
  const overdueNotifiedRef = useRef(false);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) ?? null,
    [leads, selectedLeadId]
  );

  const persistLeads = (nextLeads: Lead[]) => {
    setLeads(nextLeads);
    setSummary(computeSummary(nextLeads));
    saveLeadsToStorage(nextLeads);
  };

  const addToast = (message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const suggestionPool = useMemo(() => {
    const options = new Set<string>();
    for (const lead of leads) {
      options.add(lead.name);
      options.add(lead.company);
      options.add(lead.email);
    }
    return Array.from(options);
  }, [leads]);

  const querySuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return suggestionPool.filter((item) => item.toLowerCase().includes(q)).slice(0, 6);
  }, [searchQuery, suggestionPool]);

  const filteredLeads = useMemo(() => {
    const now = Date.now();

    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" ? true : lead.status === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        [lead.name, lead.company, lead.email, lead.phone, lead.assignedAgent, lead.source]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesDateRange = (() => {
        if (advancedFilters.dateRange === "all") return true;
        const dateValue = new Date(lead.createdAt).getTime();
        const days = advancedFilters.dateRange === "7d" ? 7 : advancedFilters.dateRange === "30d" ? 30 : 90;
        return dateValue >= now - days * 86_400_000;
      })();

      const matchesSource =
        advancedFilters.sources.length === 0 || advancedFilters.sources.includes(lead.source);
      const matchesRegion =
        advancedFilters.regions.length === 0 || advancedFilters.regions.includes(lead.region);
      const matchesAgent =
        advancedFilters.agents.length === 0 || advancedFilters.agents.includes(lead.assignedAgent);

      return matchesStatus && matchesSearch && matchesDateRange && matchesSource && matchesRegion && matchesAgent;
    });
  }, [leads, statusFilter, searchQuery, advancedFilters]);

  const sortedLeads = useMemo(() => {
    const statusOrder: Record<LeadStatus, number> = {
      hot: 0,
      warm: 1,
      cold: 2,
      archived: 3,
    };

    const sorted = [...filteredLeads].sort((a, b) => {
      let left: string | number = "";
      let right: string | number = "";

      if (sortKey === "name") {
        left = a.name.toLowerCase();
        right = b.name.toLowerCase();
      } else if (sortKey === "status") {
        left = statusOrder[a.status];
        right = statusOrder[b.status];
      } else if (sortKey === "assignedAgent") {
        left = a.assignedAgent.toLowerCase();
        right = b.assignedAgent.toLowerCase();
      } else {
        left = new Date(a.lastActivityAt).getTime();
        right = new Date(b.lastActivityAt).getTime();
      }

      if (left < right) return sortDirection === "asc" ? -1 : 1;
      if (left > right) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredLeads, sortKey, sortDirection]);

  const visibleLeads = useMemo(() => sortedLeads.slice(0, visibleCount), [sortedLeads, visibleCount]);
  const hasMoreRows = visibleCount < sortedLeads.length;

  const overdueCount = useMemo(
    () => leads.filter((lead) => lead.status !== "archived" && (Date.now() - new Date(lead.lastActivityAt).getTime()) / 86_400_000 >= 4)
      .length,
    [leads]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, statusFilter, advancedFilters, sortKey, sortDirection, activeSection]);

  useEffect(() => {
    if (activeSection !== "leads") return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreRows) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedLeads.length));
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMoreRows, sortedLeads.length, activeSection]);

  useEffect(() => {
    if (overdueCount > 0 && !overdueNotifiedRef.current) {
      addToast(`${overdueCount} overdue follow-ups need attention.`, "info");
      overdueNotifiedRef.current = true;
    }
  }, [overdueCount]);

  useEffect(() => {
    setLoadingLeads(true);
    const storedLeads = loadLeadsFromStorage(SEED_LEADS);
    setLeads(storedLeads);
    setSummary(computeSummary(storedLeads));
    setLoadingLeads(false);
  }, []);

  useEffect(() => {
    if (!selectedLead) {
      setAiSuggestion("");
      return;
    }

    let cancelled = false;

    const resolveSuggestion = async () => {
      setAiLoading(true);
      try {
        const response = await fetch("/api/ai/follow-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead: selectedLead }),
        });

        if (!response.ok) throw new Error("Using local suggestion");
        const payload = (await response.json()) as { suggestion?: string };

        if (!cancelled) {
          setAiSuggestion(payload.suggestion?.trim() || suggestionForLead(selectedLead));
        }
      } catch {
        if (!cancelled) {
          setAiSuggestion(suggestionForLead(selectedLead));
        }
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    };

    resolveSuggestion();

    return () => {
      cancelled = true;
    };
  }, [selectedLead]);

  const canWrite = role !== "Viewer";
  const canSync = role === "Admin";

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const updateMultiFilter = (group: "sources" | "regions" | "agents", value: string) => {
    setAdvancedFilters((prev) => {
      const exists = prev[group].includes(value);
      return {
        ...prev,
        [group]: exists ? prev[group].filter((item) => item !== value) : [...prev[group], value],
      };
    });
  };

  const resetAdvancedFilters = () => {
    setAdvancedFilters({ dateRange: "all", sources: [], regions: [], agents: [] });
    addToast("Filters reset.", "info");
  };

  const exportCsv = () => {
    const headers = ["Name", "Company", "Email", "Phone", "Status", "Last Activity", "Assigned Agent", "Source", "Region", "Score"];
    const rows = sortedLeads.map((lead) => [
      lead.name,
      lead.company,
      lead.email,
      lead.phone,
      lead.status,
      formatSince(lead.lastActivityAt),
      lead.assignedAgent,
      lead.source,
      lead.region,
      String(lead.score),
    ]);

    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `amolex-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);

    addToast("Leads exported to CSV.", "success");
  };

  const syncGoogleSheets = async () => {
    if (!canSync) {
      addToast("Only Admin can sync Google Sheets.", "error");
      return;
    }

    try {
      const response = await fetch("/api/integrations/google-sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: sortedLeads }),
      });

      if (!response.ok) throw new Error("Sync failed");
      addToast("Leads synced to Google Sheets.", "success");
    } catch {
      addToast("Google Sheets sync endpoint unavailable in this environment.", "error");
    }
  };

  const syncCrm = async () => {
    if (!canSync) {
      addToast("Only Admin can run CRM sync.", "error");
      return;
    }

    try {
      const response = await fetch("/api/crm/sync", { method: "POST" });
      if (!response.ok) throw new Error("Sync failed");
      addToast("CRM sync started.", "success");
    } catch {
      addToast("CRM sync endpoint unavailable in this environment.", "error");
    }
  };

  const startOrStopVoice = () => {
    if (!canWrite) {
      addToast("Viewer role cannot create notes.", "error");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionCtor) {
      addToast("Voice-to-text is not supported in this browser.", "error");
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (transcript) {
        setNoteDraft((prev) => `${prev}${prev ? " " : ""}${transcript}`);
        addToast("Voice note transcribed.", "success");
      }
    };

    recognition.onerror = () => {
      addToast("Voice capture failed. Please try again.", "error");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const saveNote = () => {
    if (!selectedLead || !noteDraft.trim()) return;
    if (!canWrite) {
      addToast("Viewer role cannot save notes.", "error");
      return;
    }

    const content = noteDraft.trim();

    const nextLeads = leads.map((lead) => {
      if (lead.id !== selectedLead.id) return lead;

      const newNote: LeadNote = {
        id: `${lead.id}-note-${Date.now()}`,
        author: role === "Sales" ? "Sales User" : "Admin User",
        content,
        at: new Date().toISOString(),
        source: isListening ? "voice" : "manual",
      };

      const newTimeline: TimelineEvent = {
        id: `${lead.id}-timeline-${Date.now()}`,
        type: "email",
        title: "Note Added",
        note: content,
        by: newNote.author,
        at: newNote.at,
      };

      return {
        ...lead,
        notes: [newNote, ...lead.notes],
        followUpHistory: [newTimeline, ...lead.followUpHistory],
        lastActivityAt: newNote.at,
      };
    });

    persistLeads(nextLeads);
    setNoteDraft("");
    addToast("Note saved.", "success");
  };

  const updateLeadForm = <K extends keyof NewLeadFormValues>(field: K, value: NewLeadFormValues[K]) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
  };

  const addLead = () => {
    if (!canWrite) {
      addToast("Viewer role cannot add leads.", "error");
      return;
    }

    if (!leadForm.name.trim() || !leadForm.company.trim() || !leadForm.email.trim() || !leadForm.phone.trim()) {
      addToast("Name, company, email, and phone are required.", "error");
      return;
    }

    const nextLead = createLeadFromForm(leadForm);
    const nextLeads = [nextLead, ...leads];
    persistLeads(nextLeads);
    setSelectedLeadId(nextLead.id);
    setIsAddLeadOpen(false);
    setLeadForm(createEmptyLeadForm());
    addToast("New lead added.", "success");
  };

  const activeStatusCount = (status: FilterStatus) => {
    if (status === "all") return leads.length;
    return leads.filter((lead) => lead.status === status).length;
  };

  const topBarClass = darkMode
    ? "bg-[#0d1734]/95 border-blue-900/40 text-white"
    : "bg-white/95 border-blue-100 text-slate-900";

  const mainBgClass = darkMode
    ? "bg-gradient-to-br from-[#091126] via-[#0e1b3f] to-[#08102a] text-white"
    : "bg-gradient-to-br from-[#f4f8ff] via-[#eef5ff] to-[#f8fbff] text-slate-900";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("min-h-screen", mainBgClass)} />;
  }

  return (
    <div className={cn("min-h-screen", mainBgClass)}>
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden flex-col border-r transition-all duration-300",
            darkMode ? "border-blue-800 bg-[#0b1533]" : "border-blue-200 bg-white",
            sidebarCollapsed ? "w-20" : "w-72",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between border-b border-blue-100/50 px-4 py-4">
            <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
              <div className="flex h-10 w-10 items-center justify-center bg-blue-600 text-white">
                A
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn("hidden lg:inline-flex", darkMode ? "text-blue-100 hover:bg-blue-900/40" : "text-blue-800 hover:bg-blue-200")}
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="px-3 py-4">
            <div className="space-y-2">
              {sidebarLinks.map((item) => {
                const isActive = activeSection === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveSection(item.key);
                      setMobileSidebarOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 border px-3 py-2 text-left transition",
                      isActive
                        ? darkMode
                          ? "border-blue-400 bg-blue-500/20 text-blue-100"
                          : "border-blue-300 bg-blue-100 text-blue-900"
                        : darkMode
                          ? "border-transparent text-blue-100 hover:border-blue-700 hover:bg-blue-900/35"
                          : "border-transparent text-slate-800 hover:border-blue-200 hover:bg-blue-50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {mobileSidebarOpen && (
          <button
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 hidden bg-blue-600/50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <div className="flex w-full flex-col transition-all duration-300">
          <header className={cn("fixed left-0 right-0 top-0 z-30 hidden border-b px-4 py-3 lg:px-6", topBarClass)}>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={cn(darkMode ? "text-white hover:bg-blue-900/40" : "text-blue-800 hover:bg-blue-200", "lg:hidden")}
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="relative min-w-[280px] flex-1" ref={suggestionsOpenRef}>
                <Search className={cn("pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", darkMode ? "text-blue-200" : "text-blue-400")} />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search leads, company, email, or source..."
                  className={cn(
                    "pl-10",
                    darkMode
                      ? "border-blue-700 bg-blue-900/40 text-white placeholder:text-blue-200"
                      : "border-blue-200 bg-blue-50/80 text-slate-900 placeholder:text-slate-700"
                  )}
                />

                <AnimatePresence>
                  {searchQuery.trim() && querySuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                        className={cn(
                          "absolute left-0 right-0 top-[calc(100%+6px)] z-50 border",
                          darkMode ? "border-blue-700 bg-[#13204a]" : "border-blue-200 bg-white"
                        )}
                    >
                      {querySuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          className={cn(
                            "w-full border-b px-3 py-2 text-left text-sm last:border-b-0",
                            darkMode
                              ? "border-blue-900/40 text-blue-100 hover:bg-blue-900/30"
                              : "border-blue-200 text-slate-800 hover:bg-blue-50"
                          )}
                          onClick={() => setSearchQuery(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={role}
                  onChange={(event) => {
                    const newRole = event.target.value as Role;
                    setRole(newRole);
                    addToast(`Role switched to ${newRole}.`, "info");
                  }}
                  className={cn(
                    "h-10 border px-3 text-sm",
                    darkMode ? "border-blue-800 bg-blue-900/35 text-white" : "border-blue-200 bg-white text-slate-900"
                  )}
                >
                  <option>Admin</option>
                  <option>Sales</option>
                  <option>Viewer</option>
                </select>

              <Button
                variant="outline"
                className={cn("h-10 border", darkMode ? "border-blue-600 bg-blue-900/40 text-white" : "border-blue-300 bg-white text-blue-800")}
                onClick={() => setDarkMode((prev) => !prev)}
              >
                {darkMode ? "Light" : "Dark"} mode
              </Button>

                <div className="relative">
              <Button
                variant="outline"
                className={cn("h-10 border", darkMode ? "border-blue-600 bg-blue-900/40 text-white" : "border-blue-300 bg-white text-blue-800")}
              >
                <Bell className="h-4 w-4" />
              </Button>
                  {overdueCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center bg-red-500 px-1 text-[10px] font-bold text-white">
                      {overdueCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 pb-24 pt-8 lg:px-6">
            <AnimatePresence mode="wait">
              <motion.section
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "leads" ? (
                  <>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h1 className={cn("text-2xl font-bold", darkMode ? "text-white" : "text-blue-900")}>Lead Generation</h1>
                        <p className={cn("text-sm", darkMode ? "text-blue-200" : "text-blue-500")}>
                          Intelligent pipeline operations with automation and live CRM sync.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          className={cn("h-10 border", darkMode ? "border-blue-600 bg-blue-900/40 text-white" : "border-blue-300 bg-white text-blue-800")}
                          onClick={() => setShowAdvancedFilter(true)}
                        >
                          <Filter className="h-4 w-4" />
                          Advanced Filter
                        </Button>

                        <Button
                          variant="outline"
                          className={cn("h-10 border", darkMode ? "border-blue-600 bg-blue-900/40 text-white" : "border-blue-300 bg-white text-blue-800")}
                          onClick={exportCsv}
                        >
                          <Download className="h-4 w-4" />
                          Export CSV
                        </Button>

                        <Button
                          variant="outline"
                          disabled={!canSync}
                          className={cn("h-10 border", darkMode ? "border-blue-600 bg-blue-900/40 text-white" : "border-blue-300 bg-white text-blue-800")}
                          onClick={syncGoogleSheets}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          Sync Sheets
                        </Button>

                        <Button
                          className={cn("h-10 border-0 text-white", darkMode ? "bg-blue-500 hover:bg-blue-400" : "bg-blue-600 hover:bg-blue-500")}
                          disabled={!canWrite}
                          onClick={() => {
                            setLeadForm(createEmptyLeadForm());
                            setIsAddLeadOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          Add Lead
                        </Button>
                      </div>
                    </div>

                    <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {summary.map((metric) => {
                        const trendUp = metric.delta >= 0;
                        return (
                          <div
                            key={metric.key}
                            className={cn(
                              "border p-4",
                              darkMode
                                ? "border-blue-800 bg-blue-950/40"
                                : "border-blue-100 bg-white shadow-[0_4px_14px_rgba(37,99,235,0.08)]"
                            )}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <p className={cn("text-sm", darkMode ? "text-blue-200" : "text-blue-500")}>{metric.title}</p>
                              <span className={cn("flex items-center gap-1 text-xs font-semibold", trendUp ? "text-emerald-500" : "text-rose-500")}> 
                                {trendUp ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />} {Math.abs(metric.delta)}%
                              </span>
                            </div>
                            <p className={cn("text-3xl font-bold", darkMode ? "text-white" : "text-blue-900")}>{metric.value}</p>
                              <p className={cn("text-sm", darkMode ? "text-blue-200" : "text-blue-700")}>
                            vs previous week
                          </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {STATUS_FILTERS.map((chip) => {
                        const active = statusFilter === chip;
                        return (
                          <button
                            key={chip}
                            onClick={() => setStatusFilter(chip)}
                            className={cn(
                              "inline-flex items-center gap-2 border px-3 py-1.5 text-sm font-medium capitalize transition",
                              active
                                ? darkMode
                                  ? "border-blue-400 bg-blue-500/25 text-blue-100"
                                  : "border-blue-300 bg-blue-100 text-blue-800"
                                : darkMode
                                  ? "border-blue-800 bg-blue-900/30 text-blue-100 hover:bg-blue-900/50"
                                  : "border-blue-200 bg-white text-slate-800 hover:bg-blue-50"
                            )}
                          >
                            {chip}
                            <span className={cn("text-xs font-semibold", active ? (darkMode ? "text-blue-200" : "text-blue-700") : "text-slate-800")}> 
                              {activeStatusCount(chip)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className={cn(
                        "border",
                        darkMode ? "border-blue-800 bg-[#0b1635]" : "border-blue-200 bg-white"
                      )}
                    >
                      <div className={cn("border-b px-4 py-3", darkMode ? "border-blue-800" : "border-blue-200")}> 
                        <div className="grid grid-cols-[1.2fr_1.25fr_0.7fr_0.8fr_0.9fr_0.7fr] gap-3 text-sm font-semibold">
                          <SortHeader
                            label="Name"
                            sortKey="name"
                            activeSortKey={sortKey}
                            direction={sortDirection}
                            darkMode={darkMode}
                            onToggle={toggleSort}
                          />
                          <div className={cn(darkMode ? "text-blue-200" : "text-blue-700")}>Contact Info</div>
                          <SortHeader
                            label="Status"
                            sortKey="status"
                            activeSortKey={sortKey}
                            direction={sortDirection}
                            darkMode={darkMode}
                            onToggle={toggleSort}
                          />
                          <SortHeader
                            label="Last Activity"
                            sortKey="lastActivityAt"
                            activeSortKey={sortKey}
                            direction={sortDirection}
                            darkMode={darkMode}
                            onToggle={toggleSort}
                          />
                          <SortHeader
                            label="Assigned Agent"
                            sortKey="assignedAgent"
                            activeSortKey={sortKey}
                            direction={sortDirection}
                            darkMode={darkMode}
                            onToggle={toggleSort}
                          />
                          <div className={cn("text-right", darkMode ? "text-blue-200" : "text-blue-700")}>Actions</div>
                        </div>
                      </div>

                      <div className="max-h-[55vh] overflow-y-auto">
                        {loadingLeads && (
                            <div className={cn("flex items-center justify-center gap-2 border-b px-4 py-3", darkMode ? "border-blue-800 text-blue-200" : "border-blue-200 text-blue-700")}>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Refreshing leads...
                          </div>
                        )}

                        {visibleLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className={cn(
                              "grid grid-cols-[1.2fr_1.25fr_0.7fr_0.8fr_0.9fr_0.7fr] gap-3 border-b px-4 py-3 text-sm",
                              darkMode
                                ? "border-blue-800 hover:bg-blue-900/20"
                                : "border-blue-200 hover:bg-blue-50/60"
                            )}
                            onMouseEnter={(event) =>
                              setHoverPreview({ lead, x: event.clientX + 18, y: event.clientY - 18 })
                            }
                            onMouseMove={(event) =>
                              setHoverPreview({ lead, x: event.clientX + 18, y: event.clientY - 18 })
                            }
                            onMouseLeave={() => setHoverPreview(null)}
                          >
                            <div className="min-w-0">
                              <p className={cn("truncate font-semibold", darkMode ? "text-white" : "text-slate-900")}>{lead.name}</p>
                              <p className={cn("truncate text-xs font-medium", darkMode ? "text-blue-200" : "text-slate-800")}>{lead.company}</p>
                            </div>

                            <div className="min-w-0">
                              <p className={cn("truncate", darkMode ? "text-blue-100" : "text-slate-900")}>{lead.email}</p>
                              <p className={cn("truncate text-xs", darkMode ? "text-blue-200" : "text-slate-800")}>{lead.phone}</p>
                            </div>

                            <div>
                              <Badge className={cn("border capitalize", statusTone(lead.status))}>{lead.status}</Badge>
                            </div>

                            <div>
                              <p className={cn(darkMode ? "text-blue-100" : "text-slate-900")}>{formatSince(lead.lastActivityAt)}</p>
                            </div>

                            <div>
                              <p className={cn(darkMode ? "text-blue-100" : "text-slate-900")}>{lead.assignedAgent}</p>
                              <p className={cn("text-xs", darkMode ? "text-blue-200" : "text-slate-800")}>{engagementTag(lead)}</p>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn(
                                  "h-8 border px-3",
                                  darkMode
                                    ? "border-blue-600 bg-blue-900/40 text-white"
                                    : "border-blue-300 bg-white text-blue-800"
                                )}
                                onClick={() => setSelectedLeadId(lead.id)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        ))}

                        {!loadingLeads && visibleLeads.length === 0 && (
                          <div className={cn("px-4 py-12 text-center text-sm", darkMode ? "text-blue-200" : "text-slate-900")}>
                            No leads match your current filters.
                          </div>
                        )}

                        <div ref={sentinelRef} className="py-4 text-center">
                          {hasMoreRows ? (
                            <span className={cn("text-xs", darkMode ? "text-blue-200" : "text-slate-800")}>
                              Scroll to load more leads...
                            </span>
                          ) : (
                            <span className={cn("text-xs", darkMode ? "text-blue-200" : "text-slate-800")}>
                              Showing all {sortedLeads.length} leads.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className={cn(
                      "border p-6",
                      darkMode ? "border-blue-800 bg-[#0b1635]" : "border-blue-200 bg-white"
                    )}
                  >
                    <h2 className={cn("text-xl font-semibold", darkMode ? "text-white" : "text-blue-900")}>
                      {activeSection === "client-reports" ? "Client Reports" : "Team Tasks"}
                    </h2>
                    <p className={cn("mt-2 max-w-3xl text-sm leading-7", darkMode ? "text-blue-200" : "text-slate-800")}>
                      This panel is ready for your next integration. Keep this section connected to your reporting and task APIs while using the same role-based controls and notification framework.
                    </p>
                  </div>
                )}
              </motion.section>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showAdvancedFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-blue-600/55 px-4"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
                className={cn(
                  "w-full max-w-2xl border p-5",
                  darkMode ? "border-blue-700 bg-[#0f1e47] text-white" : "border-blue-200 bg-white text-slate-900"
                )}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Advanced Filters</h3>
                  <p className={cn("text-sm", darkMode ? "text-blue-200" : "text-slate-800")}>
                    Date range, source, region, and assigned agent.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowAdvancedFilter(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={cn("mb-1 block text-xs font-semibold uppercase", darkMode ? "text-blue-200" : "text-slate-800")}>Date Range</label>
                  <select
                    value={advancedFilters.dateRange}
                    onChange={(event) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        dateRange: event.target.value as AdvancedFilterState["dateRange"],
                      }))
                    }
                    className={cn(
                      "h-10 w-full border px-3 text-sm",
                      darkMode ? "border-blue-600 bg-blue-900/40 text-white" : "border-blue-200 bg-blue-50 text-slate-900"
                    )}
                  >
                    <option value="all">All Time</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>

                <FilterChecklist
                  title="Source"
                  options={SOURCE_OPTIONS}
                  selected={advancedFilters.sources}
                  darkMode={darkMode}
                  onToggle={(value) => updateMultiFilter("sources", value)}
                />
                <FilterChecklist
                  title="Region"
                  options={REGION_OPTIONS}
                  selected={advancedFilters.regions}
                  darkMode={darkMode}
                  onToggle={(value) => updateMultiFilter("regions", value)}
                />
                <FilterChecklist
                  title="Assigned Agent"
                  options={AGENT_OPTIONS}
                  selected={advancedFilters.agents}
                  darkMode={darkMode}
                  onToggle={(value) => updateMultiFilter("agents", value)}
                />
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <Button variant="outline" onClick={resetAdvancedFilters} className="border-blue-300 text-blue-800 hover:bg-blue-50">
                  Clear
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-500"
                  onClick={() => {
                    setShowAdvancedFilter(false);
                    addToast("Filter applied.", "success");
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-blue-600/40"
              onClick={() => setSelectedLeadId(null)}
              aria-label="Close lead details"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className={cn(
                "fixed right-0 top-0 z-[60] h-screen w-full overflow-y-auto border-l p-5 sm:w-[480px]",
                darkMode ? "border-blue-700 bg-[#0c1a40] text-white" : "border-blue-200 bg-white text-slate-900"
              )}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className={cn("text-xs uppercase tracking-[0.18em]", darkMode ? "text-blue-300" : "text-blue-500")}>Lead Details</p>
                  <h3 className="text-2xl font-bold">{selectedLead.name}</h3>
                  <p className={cn("text-sm", darkMode ? "text-blue-200" : "text-slate-800")}>{selectedLead.company}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedLeadId(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className={cn("mb-4 border p-4", darkMode ? "border-blue-800 bg-blue-950/40" : "border-blue-200 bg-blue-50/60")}>
                <div className="mb-2 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedLead.name)}&background=1d4ed8&color=fff`} />
                    <AvatarFallback>{selectedLead.name.split(" ").map((part) => part[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedLead.name}</p>
                    <p className={cn("text-xs", darkMode ? "text-blue-200" : "text-slate-800")}>{selectedLead.email}</p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm">
                  <DrawerInfo label="Phone" value={selectedLead.phone} darkMode={darkMode} />
                  <DrawerInfo label="Source" value={selectedLead.source} darkMode={darkMode} />
                  <DrawerInfo label="Interest" value={selectedLead.interest} darkMode={darkMode} />
                  <DrawerInfo label="Region" value={selectedLead.region} darkMode={darkMode} />
                  <DrawerInfo label="Assigned Agent" value={selectedLead.assignedAgent} darkMode={darkMode} />
                  <DrawerInfo label="Lead Score" value={`${selectedLead.score} / 100`} darkMode={darkMode} />
                  <DrawerInfo label="Engagement Tag" value={engagementTag(selectedLead)} darkMode={darkMode} />
                </div>
              </div>

              <div className={cn("mb-4 border p-4", darkMode ? "border-blue-800 bg-blue-950/35" : "border-blue-200 bg-white")}> 
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold">Follow-Up History</h4>
                  <Badge className="border-blue-200 bg-blue-100 text-blue-700">Interactive Timeline</Badge>
                </div>

                <div className="space-y-3">
                  {selectedLead.followUpHistory.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="pt-0.5">
                        <span className={cn("flex h-6 w-6 items-center justify-center border", darkMode ? "border-blue-600 bg-blue-900/40" : "border-blue-300 bg-blue-100")}> 
                          {item.type === "call" ? "C" : item.type === "email" ? "E" : "M"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className={cn("text-xs", darkMode ? "text-blue-200" : "text-slate-800")}>
                          {new Date(item.at).toLocaleString()} by {item.by}
                        </p>
                        <p className={cn("text-sm", darkMode ? "text-blue-100" : "text-slate-900")}>{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn("mb-4 border p-4", darkMode ? "border-blue-800 bg-blue-950/35" : "border-blue-200 bg-white")}> 
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold">Add Note</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canWrite}
                    className={cn("h-8 border", darkMode ? "border-blue-600 bg-blue-900/40 text-white" : "border-blue-300 bg-white text-blue-800")}
                    onClick={startOrStopVoice}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isListening ? "Stop" : "Voice"}
                  </Button>
                </div>

                <Textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder={canWrite ? "Write a note or dictate with voice..." : "Viewer role: read-only"}
                  className={cn(
                    "min-h-[120px]",
                    darkMode
                      ? "border-blue-700 bg-blue-950/40 text-white placeholder:text-blue-300"
                      : "border-blue-100 bg-blue-50/50 text-slate-900 placeholder:text-slate-700"
                  )}
                  disabled={!canWrite}
                />

                <div className="mt-3 flex justify-end">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-500"
                    disabled={!canWrite || !noteDraft.trim()}
                    onClick={saveNote}
                  >
                    Save Note
                  </Button>
                </div>
              </div>

              <div className={cn("border p-4", darkMode ? "border-blue-900 bg-blue-950/35" : "border-blue-100 bg-blue-50/50")}>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <h4 className="font-semibold">AI Next Follow-Up Suggestion</h4>
                </div>
                {aiLoading ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating recommendation...
                  </div>
                ) : (
                  <p className={cn("text-sm leading-6", darkMode ? "text-blue-100" : "text-slate-900")}>{aiSuggestion}</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddLeadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-blue-600/60 px-4 py-6"
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              className={cn(
                "flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden border shadow-2xl",
                darkMode ? "border-blue-800 bg-[#0c1a40] text-white" : "border-blue-100 bg-white text-slate-900"
              )}
            >
              <div className={cn("flex items-start justify-between border-b px-5 py-4", darkMode ? "border-blue-900/60" : "border-blue-100")}>
                <div>
                  <p className={cn("text-xs uppercase tracking-[0.18em]", darkMode ? "text-blue-300" : "text-blue-500")}>New Lead</p>
                  <h3 className="text-2xl font-bold">Create detailed lead record</h3>
                  <p className={cn("mt-1 text-sm", darkMode ? "text-blue-200" : "text-slate-700")}>
                    Capture every detail you want tied to the lead so the homepage and dashboard stay in sync.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsAddLeadOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid flex-1 gap-6 overflow-y-auto px-5 py-5 lg:grid-cols-2">
                <section className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-500">Core Info</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name">
                      <Input value={leadForm.name} onChange={(event) => updateLeadForm("name", event.target.value)} placeholder="Lead name" />
                    </Field>
                    <Field label="Company">
                      <Input value={leadForm.company} onChange={(event) => updateLeadForm("company", event.target.value)} placeholder="Company name" />
                    </Field>
                    <Field label="Email">
                      <Input type="email" value={leadForm.email} onChange={(event) => updateLeadForm("email", event.target.value)} placeholder="name@company.com" />
                    </Field>
                    <Field label="Phone">
                      <Input value={leadForm.phone} onChange={(event) => updateLeadForm("phone", event.target.value)} placeholder="+1 555 000 0000" />
                    </Field>
                    <Field label="Status">
                      <select
                        value={leadForm.status}
                        onChange={(event) => updateLeadForm("status", event.target.value as LeadStatus)}
                        className={formSelectClass(darkMode)}
                      >
                        <option value="hot">Hot</option>
                        <option value="warm">Warm</option>
                        <option value="cold">Cold</option>
                        <option value="archived">Archived</option>
                      </select>
                    </Field>
                    <Field label="Contact Preference">
                      <select
                        value={leadForm.contactPreference}
                        onChange={(event) => updateLeadForm("contactPreference", event.target.value as "email" | "phone")}
                        className={formSelectClass(darkMode)}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                      </select>
                    </Field>
                    <Field label="Source">
                      <select value={leadForm.source} onChange={(event) => updateLeadForm("source", event.target.value)} className={formSelectClass(darkMode)}>
                        {SOURCE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Interest">
                      <select value={leadForm.interest} onChange={(event) => updateLeadForm("interest", event.target.value)} className={formSelectClass(darkMode)}>
                        {INTEREST_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Region">
                      <select value={leadForm.region} onChange={(event) => updateLeadForm("region", event.target.value)} className={formSelectClass(darkMode)}>
                        {REGION_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Assigned Agent">
                      <select value={leadForm.assignedAgent} onChange={(event) => updateLeadForm("assignedAgent", event.target.value)} className={formSelectClass(darkMode)}>
                        {AGENT_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Lead Score">
                      <Input type="number" min="0" max="100" value={leadForm.score} onChange={(event) => updateLeadForm("score", event.target.value)} placeholder="0-100" />
                    </Field>
                    <Field label="Engagement Score">
                      <Input type="number" min="0" max="100" value={leadForm.engagementScore} onChange={(event) => updateLeadForm("engagementScore", event.target.value)} placeholder="0-100" />
                    </Field>
                    <Field label="Created At">
                      <Input type="datetime-local" value={leadForm.createdAt} onChange={(event) => updateLeadForm("createdAt", event.target.value)} />
                    </Field>
                    <Field label="Last Activity At">
                      <Input type="datetime-local" value={leadForm.lastActivityAt} onChange={(event) => updateLeadForm("lastActivityAt", event.target.value)} />
                    </Field>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-500">Notes and Follow-Up</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Note Author">
                      <Input value={leadForm.noteAuthor} onChange={(event) => updateLeadForm("noteAuthor", event.target.value)} placeholder="Admin or sales rep" />
                    </Field>
                    <Field label="Follow-Up By">
                      <Input value={leadForm.followUpBy} onChange={(event) => updateLeadForm("followUpBy", event.target.value)} placeholder="Who will own the follow-up" />
                    </Field>
                    <Field label="Follow-Up Type">
                      <select value={leadForm.followUpType} onChange={(event) => updateLeadForm("followUpType", event.target.value as TimelineType)} className={formSelectClass(darkMode)}>
                        <option value="call">Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                      </select>
                    </Field>
                    <Field label="Follow-Up Time">
                      <Input type="datetime-local" value={leadForm.followUpAt} onChange={(event) => updateLeadForm("followUpAt", event.target.value)} />
                    </Field>
                  </div>

                  <Field label="Lead Note">
                    <Textarea
                      value={leadForm.noteContent}
                      onChange={(event) => updateLeadForm("noteContent", event.target.value)}
                      placeholder="Capture qualification notes, budget, timing, objections, or next steps."
                      className={cn("min-h-[120px]", darkMode ? "border-blue-700 bg-blue-950/40 text-white" : "border-blue-100 bg-blue-50/50 text-slate-900")}
                    />
                  </Field>

                  <Field label="Follow-Up Title">
                    <Input value={leadForm.followUpTitle} onChange={(event) => updateLeadForm("followUpTitle", event.target.value)} placeholder="Discovery call, proposal review, etc." />
                  </Field>

                  <Field label="Follow-Up Details">
                    <Textarea
                      value={leadForm.followUpNote}
                      onChange={(event) => updateLeadForm("followUpNote", event.target.value)}
                      placeholder="What should happen next?"
                      className={cn("min-h-[120px]", darkMode ? "border-blue-700 bg-blue-950/40 text-white" : "border-blue-100 bg-blue-50/50 text-slate-900")}
                    />
                  </Field>
                </section>
              </div>

              <div className={cn("flex flex-wrap items-center justify-end gap-3 border-t px-5 py-4", darkMode ? "border-blue-900/60" : "border-blue-100")}>
                <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 text-white hover:bg-blue-500" onClick={addLead}>
                  Save Lead
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hoverPreview && activeSection === "leads" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={cn(
              "pointer-events-none fixed z-50 hidden w-72 border p-3 lg:block",
              darkMode ? "border-blue-700 bg-[#11214a] text-white" : "border-blue-100 bg-white text-slate-900"
            )}
            style={{ left: hoverPreview.x, top: hoverPreview.y }}
          >
            <p className="text-sm font-semibold">{hoverPreview.lead.name}</p>
            <p className={cn("text-xs", darkMode ? "text-blue-200" : "text-slate-700")}>
              {hoverPreview.lead.company} · {hoverPreview.lead.region}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className={cn(darkMode ? "text-blue-300" : "text-slate-700")}>Score</p>
                <p className="font-semibold">{hoverPreview.lead.score}</p>
              </div>
              <div>
                <p className={cn(darkMode ? "text-blue-300" : "text-slate-700")}>Tag</p>
                <p className="font-semibold">{engagementTag(hoverPreview.lead)}</p>
              </div>
            </div>
            <p className={cn("mt-2 text-xs", darkMode ? "text-blue-200" : "text-slate-800")}>
              Last activity: {formatSince(hoverPreview.lead.lastActivityAt)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2">
        <div className={cn("flex items-center gap-1 border px-2 py-1.5", darkMode ? "border-blue-800 bg-[#0c1839]" : "border-blue-100 bg-white shadow-sm")}> 
          {footerLinks.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="group relative">
                <button
                  className={cn(
                    "flex h-10 w-10 items-center justify-center border transition",
                    darkMode
                      ? "border-transparent text-blue-200 hover:border-blue-700 hover:bg-blue-900/40"
                      : "border-transparent text-blue-700 hover:border-blue-100 hover:bg-blue-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
                <span className={cn(
                  "pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border px-2 py-1 text-xs group-hover:block",
                  darkMode ? "border-blue-700 bg-[#152553] text-blue-100" : "border-blue-100 bg-white text-slate-900"
                )}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed right-4 top-20 z-[80] space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={cn(
                "min-w-[260px] border px-3 py-2 text-sm shadow-lg",
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : toast.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : "border-blue-200 bg-blue-50 text-blue-800"
              )}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-blue-500">{label}</span>
      {children}
    </label>
  );
}

function formSelectClass(darkMode: boolean): string {
  return cn(
    "h-10 w-full border px-3 text-sm outline-none",
    darkMode ? "border-blue-700 bg-blue-950/40 text-white" : "border-blue-100 bg-blue-50 text-slate-900"
  );
}

function SortHeader({
  label,
  sortKey,
  activeSortKey,
  direction,
  darkMode,
  onToggle,
}: {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  direction: SortDirection;
  darkMode: boolean;
  onToggle: (key: SortKey) => void;
}) {
  const isActive = sortKey === activeSortKey;

  return (
    <button
      className={cn(
        "inline-flex items-center gap-1 text-left",
        darkMode ? "text-blue-200" : "text-blue-700"
      )}
      onClick={() => onToggle(sortKey)}
    >
      {label}
      {isActive ? (
        direction === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
      )}
    </button>
  );
}

function FilterChecklist({
  title,
  options,
  selected,
  darkMode,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  darkMode: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className={cn("mb-1 text-xs font-semibold uppercase", darkMode ? "text-blue-200" : "text-slate-800")}>{title}</p>
      <div className={cn("max-h-28 space-y-1 overflow-y-auto border p-2", darkMode ? "border-blue-600 bg-blue-900/40" : "border-blue-200 bg-blue-50/40")}> 
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label key={option} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={checked} onChange={() => onToggle(option)} />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function DrawerInfo({ label, value, darkMode }: { label: string; value: string; darkMode: boolean }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <p className={cn("text-xs uppercase tracking-wide", darkMode ? "text-blue-300" : "text-slate-800")}>{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
