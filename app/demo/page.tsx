import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

// Demo page - shows sample data without requiring auth
export default async function ClientDashboardDemo() {
  // This demo page is accessible without login
  // For production, you'd add auth check
  
  return <ClientDashboardContent />;
}

function ClientDashboardContent() {
  const tenantName = "Demo Workspace";
  
  const stats = {
    totalReports: 5,
    totalSocialAccounts: 4,
    totalPosts: 28,
    totalImpressions: 17500
  };
  
  const reports = [
    { id: "1", title: "Q1 Social Performance", report_type: "social-summary" },
    { id: "2", title: "February Analytics", report_type: "social-summary" },
    { id: "3", title: "January Overview", report_type: "social-summary" }
  ];

  return (
    <ClientDashboardShell
      title="Client Overview (Demo)"
      description="View your social media analytics, reports, and performance metrics."
    >
      <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-800">
        This is a demo showing sample data. Connect to Supabase to see real data.
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.totalReports}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Social Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.totalSocialAccounts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.totalPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.totalImpressions.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="p-6">
        <h2 className="font-heading text-2xl font-semibold">Recent Reports</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-[1.5rem] border border-border/70 bg-background/50 p-5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {report.report_type}
              </p>
              <p className="mt-2 font-medium">{report.title}</p>
            </div>
          ))}
        </div>
      </Card>
    </ClientDashboardShell>
  );
}