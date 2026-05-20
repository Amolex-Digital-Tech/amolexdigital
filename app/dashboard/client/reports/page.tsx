"use client";

import { useEffect, useState } from "react";
import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, ArrowRight, Clock, ChevronDown } from "lucide-react";

type RangeKey = "7D" | "30D" | "90D" | "6M" | "1Y";

const RANGE_LABELS: Record<RangeKey, string> = {
  "7D": "7 Days",
  "30D": "30 Days",
  "90D": "90 Days",
  "6M": "6 Months",
  "1Y": "1 Year"
};

const FALLBACK_REPORTS = [
  { id: "r-30d", range: "30D" as RangeKey, asOf: new Date().toISOString(), kpis: { impressions: 684_294, engagement: 27, clicks: 22_900, shares: 12_500 } }
];

const formatNum = (n: number | undefined) => (n ?? 0).toLocaleString();

export default function ClientReportsPage() {
  const [reports, setReports] = useState<typeof FALLBACK_REPORTS>(FALLBACK_REPORTS);
  const [manualReports, setManualReports] = useState<Array<{ id: string; title: string; period_start?: string; period_end?: string }>>([]);
  const [companyName, setCompanyName] = useState("Your Workspace");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const company = localStorage.getItem("user_company_name") || "Your Workspace";
    setCompanyName(company);
    const storageKey = `metrics_${company.toLowerCase().replace(/\s/g, "_")}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      const ranges = parsed.analytics?.ranges;
      if (ranges) {
        const built = Object.entries(ranges).map(([key, value]: [string, any], idx) => ({
          id: `auto-${key}-${idx}`,
          range: key as RangeKey,
          asOf: value.asOf || parsed.analytics?.updatedAt || parsed.updatedAt,
          kpis: {
            impressions: Number(value.kpis?.impressions) || 0,
            engagement: Number(value.kpis?.engagement) || 0,
            clicks: Number(value.kpis?.clicks) || 0,
            shares: Number(value.kpis?.shares) || 0
          }
        }));
        if (built.length) setReports(built as any);
      }
      if (parsed.reports && Array.isArray(parsed.reports)) {
        const mapped = parsed.reports.map((r: any, i: number) => ({
          id: `manual-${i}`,
          title: r.title || `Report ${i + 1}`,
          period_start: r.period_start || r.date,
          period_end: r.period_end || r.date
        }));
        setManualReports(mapped);
      }
    } catch (e) {
      console.error("Failed to parse reports", e);
    }
  }, []);

  return (
    <ClientDashboardShell title="Reports" description="Time-bound performance summaries provided by your admin.">
      <div className="space-y-8">
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6a7765]">Automated Performance Snapshots</p>
            <p className="text-sm text-muted-foreground">Each card reflects the admin-configured dataset for the selected period.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report) => {
              const isOpen = expanded === report.id;
              return (
                <Card
                  key={report.id}
                  className="hover:bg-muted/40 transition-colors rounded-2xl border border-lime-200/70 cursor-pointer"
                  onClick={() => setExpanded((prev) => (prev === report.id ? null : report.id))}
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-semibold">{RANGE_LABELS[report.range]}</CardTitle>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-[#1f2a17]">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{report.asOf ? `Data as of ${new Date(report.asOf).toLocaleString()}` : "No timestamp set"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <KpiLine label="Impressions" value={formatNum(report.kpis.impressions)} />
                      <KpiLine label="Engagement (%)" value={`${report.kpis.engagement ?? 0}%`} />
                      <KpiLine label="Clicks" value={formatNum(report.kpis.clicks)} />
                      <KpiLine label="Shares" value={formatNum(report.kpis.shares)} />
                    </div>
                    {isOpen && (
                      <div className="mt-2 rounded-xl border border-lime-200/70 bg-[#f7fbf3] p-3 text-xs text-[#1f2a17] space-y-1">
                        <p className="font-semibold text-sm text-[#14301f]">Summary</p>
                        <p>• Impressions show reach for this period.</p>
                        <p>• Engagement% reflects likes/comments/shares relative to reach.</p>
                        <p>• Clicks capture outbound interactions.</p>
                        <p>• Shares represent amplification across networks.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6a7765]">Uploaded Reports</p>
            <p className="text-sm text-muted-foreground">Documents or period summaries added by your admin.</p>
          </div>
          {manualReports.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {manualReports.map((report) => (
                <Card
                  key={report.id}
                  className="hover:bg-muted/50 transition-colors rounded-2xl border border-lime-200/70 cursor-pointer"
                  onClick={() => setExpanded((prev) => (prev === report.id ? null : report.id))}
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{report.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${expanded === report.id ? "rotate-180" : ""}`} />
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">report</span>
                      {report.period_start && (
                        <>
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(report.period_start).toLocaleDateString()}
                            {report.period_end && ` - ${new Date(report.period_end).toLocaleDateString()}`}
                          </span>
                        </>
                      )}
                    </div>
                    {expanded === report.id && (
                      <div className="mt-4 rounded-xl border border-lime-200/70 bg-[#f7fbf3] p-3 text-xs text-[#1f2a17] space-y-1">
                        <p className="font-semibold text-sm text-[#14301f]">Summary</p>
                        <p>• Admin-uploaded report for this period.</p>
                        <p>• Open the document for detailed breakdown.</p>
                        <div className="mt-2 space-y-1">
                          <p className="font-semibold text-[#1f2a17]">All admin reports (overview):</p>
                          {manualReports.map((r) => (
                            <p key={r.id}>
                              - {r.title}
                              {r.period_start
                                ? ` (${new Date(r.period_start).toLocaleDateString()}${r.period_end ? " - " + new Date(r.period_end).toLocaleDateString() : ""})`
                                : ""}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                      <span>View Report</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center rounded-2xl border border-lime-200/70">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Reports Yet</h3>
              <p className="mt-2 text-muted-foreground">
                Reports will appear here when the admin creates them for your account.
              </p>
            </Card>
          )}
        </section>
      </div>
    </ClientDashboardShell>
  );
}

function KpiLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-lime-200/70 bg-[#f7fbf3] px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-[#1f2a17]">{value}</span>
    </div>
  );
}
