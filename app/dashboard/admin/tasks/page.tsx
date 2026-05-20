"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  ListTodo,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TaskStatus = "Assigned" | "In Progress" | "Review" | "Archived";
type Priority = "Low" | "Medium" | "High";

interface TaskItem {
  id: string;
  title: string;
  project: string;
  assignee: string;
  assigneeAvatar: string;
  owner: string;
  ownerAvatar: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  description: string;
  requirements: string[];
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "task_assigned" | "task_created" | "task_updated" | "comment";
  taskId: string;
  taskTitle: string;
  read: boolean;
  timestamp: string;
}

const STATUS_ORDER: TaskStatus[] = ["Assigned", "In Progress", "Review", "Archived"];

const STATUS_COLORS: Record<TaskStatus, string> = {
  Assigned: "border-blue-300 bg-blue-100 text-blue-800 font-semibold",
  "In Progress": "border-amber-300 bg-amber-100 text-amber-800 font-semibold",
  Review: "border-purple-300 bg-purple-100 text-purple-800 font-semibold",
  Archived: "border-slate-300 bg-slate-200 text-slate-900 font-semibold",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "border-green-300 bg-green-100 text-green-800 font-semibold",
  Medium: "border-yellow-300 bg-yellow-100 text-yellow-800 font-semibold",
  High: "border-orange-300 bg-orange-100 text-orange-800 font-semibold",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
};

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Design system documentation",
    project: "Brand System",
    assignee: "Sarah Chen",
    assigneeAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    owner: "Mina Hassan",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    status: "In Progress",
    priority: "High",
    dueDate: "May 5, 2026",
    createdAt: "Apr 27, 2026",
    description: "Create comprehensive documentation for the new design system including component library, typography scale, color palette, and usage guidelines.",
    requirements: [
      "Component library with 50+ reusable components",
      "Typography scale documentation",
      "Color palette with accessibility guidelines",
      "Usage examples and best practices"
    ]
  },
  {
    id: "task-2",
    title: "Q2 marketing campaign assets",
    project: "Marketing",
    assignee: "Jordan Lee",
    assigneeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    owner: "David Park",
    ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    status: "Assigned",
    priority: "High",
    dueDate: "May 3, 2026",
    createdAt: "Apr 30, 2026",
    description: "Develop visual assets for Q2 marketing campaign including social media graphics, email templates, and landing page banners.",
    requirements: [
      "10 social media graphics",
      "5 email templates",
      "3 landing page variations",
      "Brand consistency review"
    ]
  },
  {
    id: "task-3",
    title: "Client onboarding portal setup",
    project: "Platform",
    assignee: "Mina Hassan",
    assigneeAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    owner: "Mina Hassan",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    status: "Review",
    priority: "Medium",
    dueDate: "May 8, 2026",
    createdAt: "Apr 25, 2026",
    description: "Set up automated onboarding portal for new clients with welcome sequences, document collection, and account setup wizards.",
    requirements: [
      "Automated welcome email sequence",
      "Document upload portal",
      "Account setup wizard",
      "Progress tracking dashboard"
    ]
  },
  {
    id: "task-4",
    title: "API integration testing",
    project: "Infrastructure",
    assignee: "David Park",
    assigneeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    owner: "Jordan Lee",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    status: "In Progress",
    priority: "High",
    dueDate: "May 2, 2026",
    createdAt: "Apr 29, 2026",
    description: "Complete integration testing for payment gateway API and third-party service connections.",
    requirements: [
      "Payment gateway test suite",
      "Error handling validation",
      "Performance benchmarking",
      "Security audit report"
    ]
  },
  {
    id: "task-5",
    title: "User research synthesis",
    project: "Research",
    assignee: "Leila Haddad",
    assigneeAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face",
    owner: "Sarah Chen",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    status: "In Progress",
    priority: "Medium",
    dueDate: "May 6, 2026",
    createdAt: "Apr 28, 2026",
    description: "Synthesize findings from recent user interviews and usability tests into actionable insights and recommendations.",
    requirements: [
      "Interview transcript analysis",
      "Usability test findings",
      "Persona updates",
      "Priority recommendations"
    ]
  },
  {
    id: "task-6",
    title: "Security audit documentation",
    project: "Compliance",
    assignee: "Alex Morgan",
    assigneeAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    owner: "Jordan Lee",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    status: "Archived",
    priority: "Low",
    dueDate: "Apr 28, 2026",
    createdAt: "Apr 20, 2026",
    description: "Document security audit findings and remediation steps for compliance review.",
    requirements: [
      "Audit findings summary",
      "Remediation timeline",
      "Compliance checklist",
      "Stakeholder sign-off"
    ]
  },
  {
    id: "task-7",
    title: "Content calendar for May",
    project: "Publishing",
    assignee: "Sarah Chen",
    assigneeAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    owner: "Sarah Chen",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    status: "In Progress",
    priority: "Medium",
    dueDate: "May 1, 2026",
    createdAt: "Apr 24, 2026",
    description: "Plan and schedule all content for May including blog posts, social media, and newsletter campaigns.",
    requirements: [
      "30 blog posts scheduled",
      "Daily social media content",
      "Weekly newsletter themes",
      "Content approval workflow"
    ]
  },
  {
    id: "task-8",
    title: "Analytics dashboard v2",
    project: "Product",
    assignee: "Jordan Lee",
    assigneeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    owner: "Mina Hassan",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    status: "Review",
    priority: "High",
    dueDate: "May 7, 2026",
    createdAt: "Apr 26, 2026",
    description: "Build enhanced analytics dashboard with real-time metrics, custom reporting, and data export capabilities.",
    requirements: [
      "Real-time data visualization",
      "Custom report builder",
      "CSV/Excel export",
      "Mobile responsive design"
    ]
  },
];

const TEAM_MEMBERS = [
  { id: "1", name: "Sarah Chen", role: "Designer", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
  { id: "2", name: "Jordan Lee", role: "Developer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
  { id: "3", name: "Mina Hassan", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
  { id: "4", name: "David Park", role: "Developer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
  { id: "5", name: "Leila Haddad", role: "Researcher", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face" },
  { id: "6", name: "Alex Morgan", role: "Security", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
];

const CATEGORIES = {
  "Core Client Work": ["Client Campaigns", "Lead Generation", "Client Onboarding", "Client Management"],
  "Creative & Branding": ["Brand Strategy", "Graphic Design", "Content Creation", "Video Production"],
  "Digital Marketing": ["Social Media Management", "Ad Campaigns (Paid Media)", "SEO & Web Optimization", "Email Marketing"],
  "Web & Tech": ["Website Development", "Landing Pages", "Automation / CRM", "Analytics & Tracking"],
  "Strategy & Growth": ["Market Research", "Performance Reporting", "Growth Strategy", "A/B Testing"],
  "Internal Operations": ["Team Tasks", "Admin & Finance", "Hiring & HR", "Internal Projects"],
} as const;

const CATEGORY_ICONS: Record<keyof typeof CATEGORIES, string> = {
  "Core Client Work": "🎯",
  "Creative & Branding": "🎨",
  "Digital Marketing": "📱",
  "Web & Tech": "🌐",
  "Strategy & Growth": "📊",
  "Internal Operations": "🏢",
};


function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("");
}

export default function AdminTasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All");
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    requirements: "",
    objective: "",
    category: "",
    subcategory: "",
    assignee: "",
    status: "",
    dueDate: "",
    priority: "Medium" as Priority,
    attachments: [] as string[],
    checklist: [] as { id: string; text: string; completed: boolean }[],
  });
  const [newTaskErrors, setNewTaskErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const canCreateTasks = true; // In real app, check user role
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "Mina Hassan",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      role: "Owner",
      content: "Initial review complete. Please ensure all components follow the accessibility guidelines before final submission.",
      timestamp: "2 hours ago",
    },
    {
      id: "c2",
      author: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      role: "Assignee",
      content: "Working on the typography documentation now. Will have the color palette review ready by EOD.",
      timestamp: "45 minutes ago",
    },
  ]);

   const stats = useMemo(() => {
     const total = tasks.length;
     const dueToday = tasks.filter((t) => t.dueDate === "May 1, 2026" && t.status !== "Archived").length;
     const overdue = tasks.filter((t) => t.status !== "Archived" && ["May 1", "Apr 28"].some((d) => t.dueDate.includes(d))).length;
     const completed = tasks.filter((t) => t.status === "Archived").length;
     const completionRate = Math.round((completed / total) * 100);
     return { total, dueToday, overdue, completionRate };
   }, [tasks]);

   const tasksByStatus = useMemo(
     () => STATUS_ORDER.map((status) => ({ status, count: tasks.filter((task) => task.status === status).length })),
     [tasks]
   );

   const workspaceProjects = useMemo(
     () => Array.from(new Set(tasks.map((t) => t.project))).map((project) => ({ name: project, count: tasks.filter((t) => t.project === project).length })),
     [tasks]
   );

   const filteredTasks = useMemo(() => {
     const query = searchQuery.trim().toLowerCase();
     return tasks.filter((task) => {
       const matchesSearch = !query || [task.title, task.project, task.assignee].join(" ").toLowerCase().includes(query);
       const matchesProject = projectFilter === "All" || task.project === projectFilter;
       const matchesStatus = statusFilter === "All" || task.status === statusFilter;
       return matchesSearch && matchesProject && matchesStatus;
     });
   }, [tasks, searchQuery, projectFilter, statusFilter]);

  const uniqueProjects = ["All", ...Array.from(new Set(tasks.map((t) => t.project)))];
  const uniqueStatuses = ["All", ...STATUS_ORDER];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment: Comment = {
        id: `c${Date.now()}`,
        author: "You",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        role: "Admin",
        content: commentText.trim(),
        timestamp: "Just now",
      };
      setComments([newComment, ...comments]);
      setCommentText("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-blue-100 bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white shadow-[0_16px_40px_rgba(37,99,235,0.16)]">
        <div className="mx-auto max-w-[1600px] px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Workspace</p>
              <h1 className="text-3xl font-bold text-white">Projects & Tasks</h1>
              <p className="text-sm text-white/85">Manage team tasks and projects in one clean workspace.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-white sm:flex">
                <Avatar className="h-6 w-6"><AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" /><AvatarFallback>SC</AvatarFallback></Avatar>
                 <span className="text-sm font-medium text-white">Admin</span>
                 <ChevronRight className="h-4 w-4 text-white" />
              </div>
               <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full border-white/25 bg-white/10 text-white hover:bg-white/15" onClick={() => setNotificationsOpen(!notificationsOpen)}>
                <span className="sr-only">Notifications</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              {canCreateTasks ? (
                 <Button className="h-10 rounded-full bg-white px-4 font-medium text-slate-900 hover:bg-blue-50" onClick={() => setNewTaskModalOpen(true)}><Plus className="mr-2 h-4 w-4" />New Task</Button>
              ) : (
                 <Button className="h-10 rounded-full bg-white px-4 font-medium text-slate-900 opacity-50 cursor-not-allowed hover:bg-blue-50" disabled title="Only managers can create tasks"><Plus className="mr-2 h-4 w-4" />New Task</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      {notificationsOpen && (
        <div className="mx-auto max-w-[1600px] px-6">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-lg">
            <CardContent className="p-0">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
               <Button variant="ghost" size="sm" onClick={() => setNotifications([])} className="text-sm text-slate-900 hover:text-slate-900">
                     Mark all as read
                   </Button>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                 {notifications.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-12 text-center">
                     <svg className="h-12 w-12 text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                     </svg>
                     <p className="text-slate-900">No notifications yet</p>
                   </div>
                 ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={cn("p-4 transition-colors hover:bg-slate-50", notif.read ? "opacity-60" : "bg-slate-50/50")}>
                        <div className="flex items-start gap-3">
                          <div className={cn("rounded-full p-1.5", notif.type === "task_assigned" ? "bg-blue-100 text-blue-600" : notif.type === "task_created" ? "bg-emerald-100 text-emerald-600" : "bg-purple-100 text-purple-600")}>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={cn("text-sm font-semibold", notif.read ? "text-slate-700" : "text-slate-900")}>{notif.title}</p>
                              {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>}
                            </div>
                            <p className="text-sm text-slate-800 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-slate-700 mt-1">{notif.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm transition-shadow hover:shadow-md"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Total Tasks</p><p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p><p className="mt-1 text-sm text-slate-800">Active in workspace</p></div><div className="rounded-xl border border-slate-300 bg-slate-100 p-2 text-slate-900"><ListTodo className="h-5 w-5" /></div></div></CardContent></Card>
          <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm transition-shadow hover:shadow-md"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Due Today</p><p className="mt-2 text-3xl font-bold text-slate-900">{stats.dueToday}</p><p className="mt-1 text-sm text-slate-800">Requires attention</p></div><div className="rounded-xl border border-slate-300 bg-slate-100 p-2 text-slate-900"><Clock3 className="h-5 w-5" /></div></div></CardContent></Card>
          <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm transition-shadow hover:shadow-md"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Overdue</p><p className="mt-2 text-3xl font-bold text-orange-700">{stats.overdue}</p><p className="mt-1 text-sm text-slate-800">Past deadline</p></div><div className="rounded-xl border border-slate-300 bg-slate-100 p-2 text-slate-900"><CalendarDays className="h-5 w-5" /></div></div></CardContent></Card>
          <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm transition-shadow hover:shadow-md"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Completion Rate</p><p className="mt-2 text-3xl font-bold text-slate-900">{stats.completionRate}%</p><p className="mt-1 text-sm text-slate-800">Tasks archived</p></div><div className="rounded-xl border border-slate-300 bg-slate-100 p-2 text-slate-900"><CheckCircle2 className="h-5 w-5" /></div></div></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm"><CardContent className="p-5"><div className="flex items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">Workspace Index</p><h2 className="mt-2 text-lg font-semibold text-slate-900">Tasks</h2></div><span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-900">{tasks.length} items</span></div><div className="mt-4 space-y-4">            <div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">🎯 Core Client Work</p><div className="space-y-1"><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Client Campaigns</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Lead Generation</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Client Onboarding</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Client Management</span><ChevronRight className="h-4 w-4 text-slate-900" /></button></div></div><div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">🎨 Creative & Branding</p><div className="space-y-1"><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Brand Strategy</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Graphic Design</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Content Creation</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Video Production</span><ChevronRight className="h-4 w-4 text-slate-900" /></button></div></div><div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">📱 Digital Marketing</p><div className="space-y-1"><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Social Media Management</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Ad Campaigns (Paid Media)</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">SEO & Web Optimization</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Email Marketing</span><ChevronRight className="h-4 w-4 text-slate-900" /></button></div></div><div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">🌐 Web & Tech</p><div className="space-y-1"><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Website Development</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Landing Pages</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Automation / CRM</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Analytics & Tracking</span><ChevronRight className="h-4 w-4 text-slate-900" /></button></div></div><div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">📊 Strategy & Growth</p><div className="space-y-1"><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Market Research</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Performance Reporting</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Growth Strategy</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">A/B Testing</span><ChevronRight className="h-4 w-4 text-slate-900" /></button></div></div><div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">🏢 Internal Operations</p><div className="space-y-1"><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Team Tasks</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Admin & Finance</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Hiring & HR</span><ChevronRight className="h-4 w-4 text-slate-900" /></button><button className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-left transition hover:bg-blue-50"><span className="text-sm font-medium text-slate-900">Internal Projects</span><ChevronRight className="h-4 w-4 text-slate-900" /></button></div></div></div></CardContent></Card>
            <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Status Distribution</p><div className="mt-3 space-y-2">{tasksByStatus.map((item) => (<button key={item.status} onClick={() => setStatusFilter(item.status)} className={cn("flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition", statusFilter === item.status ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-white hover:bg-slate-50")}><div className="flex items-center gap-2"><span className={cn("h-2 w-2 rounded-full", item.status === "Assigned" && "bg-blue-600", item.status === "In Progress" && "bg-amber-600", item.status === "Review" && "bg-purple-600", item.status === "Archived" && "bg-slate-500")} /><span className="text-sm font-medium text-slate-800">{item.status}</span></div><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">{item.count}</span></button>))}</div></CardContent></Card>
            <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm"><CardContent className="p-5"><div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 text-center"><p className="text-sm font-semibold text-slate-900">No templates yet</p><p className="mt-1 text-xs text-slate-700">Create reusable task templates to speed up your workflow.</p></div></CardContent></Card>
          </aside>

          <section className="space-y-4">
            <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm"><CardContent className="p-5"><div className="flex flex-wrap items-center gap-3"><div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" /><Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tasks, projects, assignees..." className="pl-9" /></div><select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none hover:border-slate-400">{uniqueProjects.map((p) => (<option key={p} value={p}>{p === "All" ? "All Projects" : p}</option>))}</select><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "All")} className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none hover:border-slate-400">{uniqueStatuses.map((s) => (<option key={s} value={s}>{s === "All" ? "All Status" : s}</option>))}</select><Button variant="outline" className="h-10 rounded-xl border-slate-400 px-3 text-slate-900 hover:border-slate-500 hover:text-slate-800"><Filter className="mr-2 h-4 w-4" />Filters</Button></div></CardContent></Card>

            <Card className="rounded-2xl border border-slate-300 bg-white shadow-sm"><CardContent className="p-0"><div className="overflow-hidden rounded-2xl border border-slate-300"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead><tr className="bg-slate-100/70"><th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-900">Title</th><th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-900">Project</th><th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-900">Assignee</th><th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-900">Status</th><th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-900">Priority</th><th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-900">Due Date</th></tr></thead><tbody className="divide-y divide-slate-200 bg-white">{filteredTasks.map((task) => (<tr key={task.id} className="cursor-pointer transition-colors hover:bg-slate-50/80" onClick={() => setSelectedTask(task)}><td className="px-5 py-4"><p className="font-medium text-slate-900">{task.title}</p></td><td className="px-5 py-4"><p className="text-sm text-slate-900">{task.project}</p></td><td className="px-5 py-4"><div className="flex items-center gap-2.5"><Avatar className="h-8 w-8 border border-slate-300"><AvatarImage src={task.assigneeAvatar} /><AvatarFallback className="text-xs">{getInitials(task.assignee)}</AvatarFallback></Avatar><span className="text-sm font-medium text-slate-900">{task.assignee}</span></div></td><td className="px-5 py-4"><Badge className={cn("border", STATUS_COLORS[task.status])}>{task.status}</Badge></td><td className="px-5 py-4"><Badge className={cn("border", PRIORITY_COLORS[task.priority])}>{PRIORITY_LABELS[task.priority]}</Badge></td><td className="px-5 py-4"><div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-700" /><span className="text-sm text-slate-900">{task.dueDate}</span></div></td></tr>))}</tbody></table></div></div><div className="border-t border-blue-100 bg-blue-50/70 px-5 py-3"><p className="text-xs text-blue-900">Showing <span className="font-medium text-blue-900">{filteredTasks.length}</span> of <span className="font-medium text-blue-900">{tasks.length}</span> tasks</p></div></CardContent></Card>
          </section>
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-slate-950/50 backdrop-blur-sm">
          <div className="h-full w-full max-w-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-300 px-6 py-4">
               <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">Task Details</p><h2 className="mt-1 text-xl font-bold text-slate-900">{selectedTask.title}</h2><p className="mt-1 text-sm text-slate-900">Created on {selectedTask.createdAt}</p></div>
               <Button variant="ghost" size="icon" className="rounded-full border border-slate-300 bg-white text-slate-900 hover:text-slate-700" onClick={() => setSelectedTask(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(100vh - 80px)" }}>
              <div className="mb-6 flex flex-wrap gap-2"><Badge className={cn("border text-sm", STATUS_COLORS[selectedTask.status])}>{selectedTask.status}</Badge><Badge className={cn("border text-sm", PRIORITY_COLORS[selectedTask.priority])}>{PRIORITY_LABELS[selectedTask.priority]} Priority</Badge></div>
              <Card className="mb-6 rounded-xl border border-slate-300 bg-slate-50/50"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">Description</p><p className="mt-3 text-sm leading-relaxed text-slate-900">{selectedTask.description}</p></CardContent></Card>
              <div className="mb-6 grid gap-4 sm:grid-cols-2"><Card className="rounded-xl border border-slate-300 bg-slate-50/50"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">Project</p><p className="mt-2 font-semibold text-slate-900">{selectedTask.project}</p></CardContent></Card><Card className="rounded-xl border border-slate-300 bg-slate-50/50"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">Due Date</p><div className="mt-2 flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-900" /><p className="font-semibold text-slate-900">{selectedTask.dueDate}</p></div></CardContent></Card><Card className="rounded-xl border border-slate-300 bg-slate-50/50"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">Assignee</p><div className="mt-2 flex items-center gap-2.5"><Avatar className="h-9 w-9 border border-slate-300"><AvatarImage src={selectedTask.assigneeAvatar} /><AvatarFallback className="text-xs">{getInitials(selectedTask.assignee)}</AvatarFallback></Avatar><div><p className="font-semibold text-slate-900">{selectedTask.assignee}</p><p className="text-xs text-slate-900">Task Owner</p></div></div></CardContent></Card><Card className="rounded-xl border border-slate-300 bg-slate-50/50"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Owner</p><div className="mt-2 flex items-center gap-2.5"><Avatar className="h-9 w-9 border border-slate-300"><AvatarImage src={selectedTask.ownerAvatar} /><AvatarFallback className="text-xs">{getInitials(selectedTask.owner)}</AvatarFallback></Avatar><div><p className="font-semibold text-slate-900">{selectedTask.owner}</p><p className="text-xs text-slate-900">Project Owner</p></div></div></CardContent></Card></div>
              <Card className="mb-6 rounded-xl border border-slate-300 bg-slate-50/50"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">Requirements</p><ul className="mt-3 space-y-2">{selectedTask.requirements.map((req, idx) => (<li key={idx} className="flex items-start gap-2 text-sm text-slate-900"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" /><span>{req}</span></li>))}</ul></CardContent></Card>
              <Card className="mb-6 rounded-xl border border-slate-300 bg-slate-50/50"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Status</p><div className="mt-3"><select value={selectedTask.status} onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value as TaskStatus })} className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none hover:border-slate-400"><option value="Assigned">Assigned</option><option value="In Progress">In Progress</option><option value="Review">Review</option><option value="Archived">Archived</option></select></div></CardContent></Card>
              <Card className="mb-6 rounded-xl border border-slate-300 bg-slate-50/50"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">Comments ({comments.length})</p><div className="mt-4 space-y-3">{comments.map((c) => (<div key={c.id} className="flex gap-3"><Avatar className="h-8 w-8 border border-slate-300"><AvatarImage src={c.avatar} /><AvatarFallback className="text-xs">{getInitials(c.author)}</AvatarFallback></Avatar><div className="flex-1"><div className="flex items-center gap-2"><p className="text-xs font-medium text-slate-900">{c.author}</p><span className="text-[10px] font-medium text-slate-800">{c.role}</span><span className="text-[10px] text-slate-700">· {c.timestamp}</span></div><p className="mt-1 text-sm text-slate-900">{c.content}</p></div></div>))}</div><form onSubmit={handleAddComment} className="mt-4"><div className="flex gap-2"><Textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="min-h-[80px] resize-none" /><Button type="submit" size="icon" className="h-10 w-10 shrink-0"><Send className="h-4 w-4" /></Button></div></form></CardContent></Card>
            </div>
          </div>
        </div>
      )}
    
      {/* New Task Modal */}
      {newTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-300 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-300 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Create New Task</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">New Task</h2>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full border border-slate-300 bg-white" onClick={() => setNewTaskModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(100vh - 200px)" }}>
              {saveStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Task Created Successfully!</h3>
                  <p className="text-sm text-slate-800 mb-6">The task has been added to the workspace.</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => {
                      setNewTaskModalOpen(false);
                      setSaveStatus("idle");
                                             setNewTask({ title: "", description: "", requirements: "", objective: "", category: "", subcategory: "", assignee: "", status: "Assigned" as TaskStatus, dueDate: "", priority: "Medium" as Priority, attachments: [], checklist: [] });
                    }}>Create Another</Button>
                    <Button onClick={() => {
                      setNewTaskModalOpen(false);
                      setSaveStatus("idle");
                                             setNewTask({ title: "", description: "", requirements: "", objective: "", category: "", subcategory: "", assignee: "", status: "Assigned" as TaskStatus, dueDate: "", priority: "Medium" as Priority, attachments: [], checklist: [] });
                    }}>Close</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Validate
                  const errors: Record<string, string> = {};
                   if (!newTask.title.trim()) errors.title = "Task title is required";
                   if (!newTask.description.trim()) errors.description = "Description is required";
                   if (!newTask.requirements.trim()) errors.requirements = "Requirements are required";
                   if (!newTask.category) errors.category = "Category is required";
                   if (!newTask.subcategory) errors.subcategory = "Subcategory is required";
                   if (!newTask.assignee) errors.assignee = "Assignee is required";
                   if (!newTask.status) errors.status = "Status is required";
                   if (!newTask.dueDate) errors.dueDate = "Due date is required";
                  
                  setNewTaskErrors(errors);
                  
                  if (Object.keys(errors).length === 0) {
                    setSaveStatus("saving");
                     // Create the new task
                     const createdTask: TaskItem = {
                       id: `task-${Date.now()}`,
                       title: newTask.title.trim(),
                       project: newTask.subcategory || newTask.category,
                       assignee: newTask.assignee,
                       assigneeAvatar: TEAM_MEMBERS.find(m => m.name === newTask.assignee)?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
                       owner: "Admin", // Current user
                       ownerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
                       status: newTask.status as TaskStatus,
                       priority: newTask.priority,
                       dueDate: new Date(newTask.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
                       createdAt: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
                       description: newTask.description,
                       requirements: newTask.requirements.split("\n").filter(r => r.trim())
                     };
                    
                    setTasks([createdTask, ...tasks]);
                    // Create notification for assigned person
                    const assigneeMember = TEAM_MEMBERS.find(m => m.name === newTask.assignee);
                    const newNotification: Notification = {
                      id: `notif-${Date.now()}`,
                      title: "New Task Assigned",
                      message: `You have been assigned to "${createdTask.title}" (${createdTask.project})`,
                      type: "task_assigned",
                      taskId: createdTask.id,
                      taskTitle: createdTask.title,
                      read: false,
                      timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                    setSaveStatus("success");
                    
                    // Reset form after success
                    setTimeout(() => {
                      setNewTaskModalOpen(false);
                                             setNewTask({ title: "", description: "", requirements: "", objective: "", category: "", subcategory: "", assignee: "", status: "Assigned" as TaskStatus, dueDate: "", priority: "Medium" as Priority, attachments: [], checklist: [] });
                      setNewTaskErrors({});
                    }, 1000);
                  }
                }}>
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-slate-300 bg-slate-50/50 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-1">
                            Task Title <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="e.g. Design Instagram campaign for product launch"
                            className={newTaskErrors.title ? "border-red-300 focus:border-red-500" : ""}
                          />
                          {newTaskErrors.title && <p className="mt-1 text-xs text-red-500">{newTaskErrors.title}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-1">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <Textarea
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            placeholder="Explain what needs to be done and provide context..."
                            className={`min-h-[100px] resize-none ${newTaskErrors.description ? "border-red-300 focus:border-red-500" : ""}`}
                          />
                          {newTaskErrors.description && <p className="mt-1 text-xs text-red-500">{newTaskErrors.description}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-1">
                            Requirements <span className="text-red-500">*</span>
                          </label>
                          <Textarea
                            value={newTask.requirements}
                            onChange={(e) => setNewTask({ ...newTask, requirements: e.target.value })}
                            placeholder="Include format, tools, platform, and deliverables..."
                            className={`min-h-[100px] resize-none ${newTaskErrors.requirements ? "border-red-300 focus:border-red-500" : ""}`}
                          />
                          {newTaskErrors.requirements && <p className="mt-1 text-xs text-red-500">{newTaskErrors.requirements}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-1">Objective (optional)</label>
                          <Input
                            value={newTask.objective}
                            onChange={(e) => setNewTask({ ...newTask, objective: e.target.value })}
                            placeholder="e.g. Increase engagement or Generate leads"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="rounded-xl border border-slate-300 bg-slate-50/50 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-4">Category (Workspace Index)</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Select Category <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {Object.entries(CATEGORIES).map(([cat, items]) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  setNewTask({ ...newTask, category: cat, subcategory: "" });
                                  setNewTaskErrors({ ...newTaskErrors, category: "" });
                                }}
                                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${newTask.category === cat ? "border-slate-300 bg-slate-100" : "border-slate-100 bg-white hover:bg-slate-50"}`}
                              >
                                <span className="text-lg">{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]}</span>
                                <div className="text-left">
                                  <p className="text-sm font-medium text-slate-900">{cat}</p>
                                  <p className="text-xs text-slate-700">{items.length} items</p>
                                </div>
                              </button>
                            ))}
                          </div>
                          {newTaskErrors.category && <p className="mt-2 text-xs text-red-500">{newTaskErrors.category}</p>}
                        </div>
                        {newTask.category && (
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                              Select Subcategory <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {CATEGORIES[newTask.category as keyof typeof CATEGORIES].map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => {
                                    setNewTask({ ...newTask, subcategory: item });
                                    setNewTaskErrors({ ...newTaskErrors, subcategory: "" });
                                  }}
                                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${newTask.subcategory === item ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                                >
                                  <span className="text-sm font-medium text-slate-800">{item}</span>
                                  <ChevronRight className="h-4 w-4 text-slate-900" />
                                </button>
                              ))}
                            </div>
                            {newTaskErrors.subcategory && <p className="mt-2 text-xs text-red-500">{newTaskErrors.subcategory}</p>}
                          </div>
                        )}
                      </div>
                    </div>

                     {/* Assignment & Due Date */}
                      <div className="rounded-xl border border-slate-300 bg-slate-50/50 p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-4">Assignment & Timeline</h3>
                       <div className="grid gap-4 sm:grid-cols-2">
                         <div>
                           <label className="block text-sm font-medium text-slate-900 mb-2">
                             Assignee <span className="text-red-500">*</span>
                           </label>
                           <select
                             value={newTask.assignee}
                             onChange={(e) => {
                               setNewTask({ ...newTask, assignee: e.target.value });
                               setNewTaskErrors({ ...newTaskErrors, assignee: "" });
                             }}
                             className={`h-10 w-full rounded-xl border px-3 text-sm outline-none hover:border-slate-300 ${newTaskErrors.assignee ? "border-red-300" : "border-slate-200"}`}
                           >
                             <option value="">Select assignee...</option>
                             {TEAM_MEMBERS.map((member) => (
                               <option key={member.id} value={member.name}>{member.name} - {member.role}</option>
                             ))}
                           </select>
                           {newTaskErrors.assignee && <p className="mt-1 text-xs text-red-500">{newTaskErrors.assignee}</p>}
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-900 mb-2">
                             Status <span className="text-red-500">*</span>
                           </label>
                           <select
                             value={newTask.status}
                             onChange={(e) => {
                               setNewTask({ ...newTask, status: e.target.value as TaskStatus });
                               setNewTaskErrors({ ...newTaskErrors, status: "" });
                             }}
                             className={`h-10 w-full rounded-xl border px-3 text-sm outline-none hover:border-slate-300 ${newTaskErrors.status ? "border-red-300" : "border-slate-200"}`}
                           >
                             <option value="">Select status...</option>
                             {STATUS_ORDER.map((status) => (
                               <option key={status} value={status}>{status}</option>
                             ))}
                           </select>
                           {newTaskErrors.status && <p className="mt-1 text-xs text-red-500">{newTaskErrors.status}</p>}
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-900 mb-2">
                             Due Date <span className="text-red-500">*</span>
                           </label>
                           <input
                             type="date"
                             value={newTask.dueDate}
                             onChange={(e) => {
                               setNewTask({ ...newTask, dueDate: e.target.value });
                               setNewTaskErrors({ ...newTaskErrors, dueDate: "" });
                             }}
                             className={`h-10 w-full rounded-xl border px-3 text-sm outline-none hover:border-slate-300 ${newTaskErrors.dueDate ? "border-red-300" : "border-slate-200"}`}
                           />
                           {newTaskErrors.dueDate && <p className="mt-1 text-xs text-red-500">{newTaskErrors.dueDate}</p>}
                         </div>
                       </div>
                     </div>

                    {/* Priority */}
                      <div className="rounded-xl border border-slate-300 bg-slate-50/50 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-4">Priority</h3>
                      <div className="flex gap-3">
                        {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewTask({ ...newTask, priority: p })}
                            className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${newTask.priority === p ? (p === "High" ? "border-orange-200 bg-orange-50 text-orange-700" : p === "Medium" ? "border-yellow-200 bg-yellow-50 text-yellow-700" : "border-green-200 bg-green-50 text-green-700") : "border-slate-100 bg-white text-slate-800 hover:bg-slate-50"}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Section */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                      <button
                        type="button"
                        onClick={() => setAdvancedOpen(!advancedOpen)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">Advanced</span>
                        <ChevronRight className={`h-4 w-4 text-slate-700 transition-transform ${advancedOpen ? "rotate-90" : ""}`} />
                      </button>
                      {advancedOpen && (
                        <div className="mt-4 space-y-4 pt-4">
                          <div className="border-t border-slate-100 pt-4">
                            <label className="block text-sm font-medium text-slate-900 mb-2">Attachments</label>
                            <div className="flex items-center gap-2">
                              <Input placeholder="Paste file link or upload..." />
                              <Button variant="outline" size="sm">Add</Button>
                            </div>
                            {newTask.attachments.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {newTask.attachments.map((att, i) => (
                                  <span key={i} className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs">
                                    {att}
                                    <button type="button" className="text-slate-700 hover:text-slate-900">×</button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="border-t border-slate-100 pt-4">
                            <label className="block text-sm font-medium text-slate-900 mb-2">Checklist (Subtasks)</label>
                            <div className="space-y-2">
                              {newTask.checklist.map((item, i) => (
                                <div key={item.id} className="flex items-center gap-2">
                                  <input type="checkbox" checked={item.completed} onChange={(e) => {
                                    const newChecklist = [...newTask.checklist];
                                    newChecklist[i].completed = e.target.checked;
                                    setNewTask({ ...newTask, checklist: newChecklist });
                                  }} className="h-4 w-4 rounded border-slate-300" />
                                  <Input value={item.text} onChange={(e) => {
                                    const newChecklist = [...newTask.checklist];
                                    newChecklist[i].text = e.target.value;
                                    setNewTask({ ...newTask, checklist: newChecklist });
                                  }} className="text-sm"
                                  />
                                  <button type="button" onClick={() => {
                                    setNewTask({ ...newTask, checklist: newTask.checklist.filter((_, idx) => idx !== i) });
                                  }} className="text-slate-700 hover:text-red-500">
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => setNewTask({ ...newTask, checklist: [...newTask.checklist, { id: Date.now().toString(), text: "", completed: false }] })}
                                className="flex items-center gap-1 text-sm text-slate-700 hover:text-slate-900"
                              >
                                <Plus className="h-4 w-4" />
                                Add subtask
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
                    <Button type="button" variant="outline" onClick={() => {
                      setNewTaskModalOpen(false);
                                             setNewTask({ title: "", description: "", requirements: "", objective: "", category: "", subcategory: "", assignee: "", status: "", dueDate: "", priority: "Medium" as Priority, attachments: [], checklist: [] });
                      setNewTaskErrors({});
                    }}>Cancel</Button>
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="outline" onClick={() => {
                        // Quick save as draft
                        setSaveStatus("saving");
                        setTimeout(() => setSaveStatus("success"), 500);
                      }}>Save as Draft</Button>
                      <Button type="submit" disabled={saveStatus === "saving"} className="bg-blue-600 hover:bg-blue-700">
                        {saveStatus === "saving" ? "Creating..." : "Create Task"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}</div>
  );
}
