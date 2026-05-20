"use client";

import { useEffect, useState } from "react";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Bell, Lock, Building } from "lucide-react";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

// Sample data for demo
const SAMPLE_TENANT = {
  plan: "premium",
  status: "active"
};

export default function ClientSettingsPage() {
  const tenant = SAMPLE_TENANT;
  const [workspaceName, setWorkspaceName] = useState("Your Workspace");
  const [clientLogo, setClientLogo] = useState<string | null>(null);

  useEffect(() => {
    const storedCompany = localStorage.getItem("user_company_name") || workspaceName;
    setWorkspaceName(storedCompany);
    const key = `client_logo_${storedCompany.toLowerCase().replace(/\s/g, "_")}`;
    const logo = localStorage.getItem(key);
    setClientLogo(logo);
  }, []);

  return (
    <ClientDashboardShell
      title="Settings"
      description="Manage your account and workspace settings."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your personal account settings</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SignOutButton
                variant="outline"
                size="sm"
                className="rounded-full border border-border bg-white/80 px-3 shadow-sm hover:bg-white"
              />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Email and profile settings are managed through your login provider.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Your organization settings</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Workspace Name</span>
                <span className="font-medium">{workspaceName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{tenant.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{tenant.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Notification settings will be available in a future update.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Password and security settings</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Security settings are managed through Supabase Auth.
            </p>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardShell>
  );
}
