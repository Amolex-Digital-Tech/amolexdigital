"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Calendar, Clock, Plus, X } from "lucide-react";

type Entry = {
  id: string;
  date: string;
  platform: string;
  type: "Post" | "Campaign";
  contentType: "Video" | "Blog" | "Infographic";
  status: "Draft" | "Scheduled" | "In Progress" | "Published";
  note?: string;
};

type Client = {
  id: string;
  company_name: string;
};

export default function AdminMarketingCalendarPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState<Entry>({
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    platform: "Instagram",
    type: "Post",
    contentType: "Video",
    status: "Scheduled",
    note: ""
  });

  useEffect(() => {
    const adminSession = localStorage.getItem("admin_session");
    if (!adminSession) {
      router.push("/dashboard/admin/sign-in");
      return;
    }
    setIsAuthenticated(true);
    const storedClients = localStorage.getItem("admin_clients");
    if (storedClients) {
      const parsed = JSON.parse(storedClients) as Client[];
      setClients(parsed);
      if (parsed[0]) setSelectedClientId(parsed[0].id);
    }
  }, [router]);

  useEffect(() => {
    if (!selectedClientId) return;
    const client = clients.find((c) => c.id === selectedClientId);
    if (!client) return;
    const key = `calendar_${client.company_name.toLowerCase().replace(/\s/g, "_")}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    } else {
      setEntries([]);
    }
  }, [selectedClientId, clients]);

  const saveEntries = (data: Entry[]) => {
    const client = clients.find((c) => c.id === selectedClientId);
    if (!client) return;
    const key = `calendar_${client.company_name.toLowerCase().replace(/\s/g, "_")}`;
    localStorage.setItem(key, JSON.stringify(data));
    setEntries(data);
  };

  const handleAdd = () => {
    if (!selectedClientId) return;
    const next = [...entries, form];
    saveEntries(next);
    setForm({
      ...form,
      id: crypto.randomUUID(),
      note: "",
      date: form.date
    });
  };

  const handleRemove = (id: string) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };

  const grouped = useMemo(() => {
    return entries.reduce<Record<string, Entry[]>>((acc, entry) => {
      acc[entry.date] = acc[entry.date] ? [...acc[entry.date], entry] : [entry];
      return acc;
    }, {});
  }, [entries]);

  if (!isAuthenticated) return null;

  return (
    <div className="container py-12 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold">Marketing Calendar</h1>
          <p className="text-muted-foreground">Schedule posts and campaigns per platform.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm text-muted-foreground">Client</label>
          <select
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </select>
        </div>
      </div>

      <Card className="border-lime-200/70">
        <CardHeader>
          <CardTitle className="text-lg">Add Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Platform</label>
              <select
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
              >
                <option>Instagram</option>
                <option>Facebook</option>
                <option>Twitter</option>
                <option>LinkedIn</option>
                <option>Threads</option>
                <option>TikTok</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <select
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Entry["type"] })}
              >
                <option>Post</option>
                <option>Campaign</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Content Type</label>
              <select
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.contentType}
                onChange={(e) => setForm({ ...form, contentType: e.target.value as Entry["contentType"] })}
              >
                <option>Video</option>
                <option>Blog</option>
                <option>Infographic</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Entry["status"] })}
              >
                <option>Draft</option>
                <option>Scheduled</option>
                <option>In Progress</option>
                <option>Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Optional brief description"
            />
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add to Calendar
          </Button>
        </CardContent>
      </Card>

      <Card className="border-lime-200/70">
        <CardHeader>
          <CardTitle className="text-lg">Scheduled Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
          {Object.keys(grouped)
            .sort()
            .map((date) => (
              <div key={date} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1f2a17]">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(date).toLocaleDateString()}
                </div>
                <div className="space-y-2">
                  {grouped[date].map((entry) => (
                    <div key={entry.id} className="flex flex-col gap-2 rounded-xl border border-lime-200/70 bg-[#f7fbf3] px-3 py-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-[#14301f]">{entry.platform} — {entry.type}</div>
                        <button className="text-xs text-red-500 hover:underline" onClick={() => handleRemove(entry.id)}>
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Content: {entry.contentType}</span>
                        <span>Status: {entry.status}</span>
                      </div>
                      {entry.note && <p className="text-xs text-[#1f2a17]">Note: {entry.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
