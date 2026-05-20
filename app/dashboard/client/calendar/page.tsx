"use client";

import { useEffect, useMemo, useState } from "react";
import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, Play } from "lucide-react";

type Entry = {
  id: string;
  date: string;
  platform: string;
  type: string;
  contentType: string;
  status: string;
  note?: string;
};

export default function ClientCalendarPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const company = localStorage.getItem("user_company_name") || "amolex";
    const key = `calendar_${company.toLowerCase().replace(/\s/g, "_")}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  const grouped = useMemo(() => {
    return entries.reduce<Record<string, Entry[]>>((acc, entry) => {
      acc[entry.date] = acc[entry.date] ? [...acc[entry.date], entry] : [entry];
      return acc;
    }, {});
  }, [entries]);

  return (
    <ClientDashboardShell title="Marketing Calendar" description="See all scheduled posts and campaigns set by your admin.">
      <div className="space-y-6">
        {entries.length === 0 && (
          <Card className="p-8 text-center">
            <h3 className="mt-2 text-lg font-semibold">No items scheduled</h3>
            <p className="text-muted-foreground">Your admin hasn’t scheduled anything yet.</p>
          </Card>
        )}

        {Object.keys(grouped)
          .sort()
          .map((date) => (
            <Card key={date} className="border-lime-200/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  {new Date(date).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {grouped[date].map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-lime-200/70 bg-[#f7fbf3] px-3 py-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-[#1f2a17]">{entry.platform} — {entry.type}</div>
                      <StatusPill status={entry.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>Content: {entry.contentType}</span>
                    </div>
                    {entry.note && <p className="mt-1 text-xs text-[#1f2a17]">Note: {entry.note}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
      </div>
    </ClientDashboardShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-700",
    Scheduled: "bg-amber-100 text-amber-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Published: "bg-green-100 text-green-800"
  };
  const Icon = status === "Published" ? CheckCircle2 : status === "In Progress" ? Play : Clock;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${styles[status] ?? "bg-muted text-foreground"}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
