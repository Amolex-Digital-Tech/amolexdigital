"use client";

import { useState } from "react";
import { AlertCircle, Loader2, ShieldCheck, UserPlus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type EmployeeItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  photoUrl: string | null;
  tenantId: string | null;
  active: boolean;
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  initialEmployees: EmployeeItem[];
  initialError: string | null;
};

export function EmployeeManager({ initialEmployees, initialError }: Props) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    position: "",
    active: true
  });

  const employeeCount = employees.length;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Failed to create employee.");
        return;
      }

      setEmployees((current) => [result.employee, ...current]);
      setMessage(`Employee ${result.employee.name} was created successfully.`);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "employee",
        position: "",
        active: true
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">Employee Access</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold">Register employees</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
            Create login credentials for authorized team members. Each employee uses their email and password
            to access the admin dashboard.
          </p>
        </div>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Total employees</p>
              <p className="text-2xl font-semibold">{employeeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-secondary" />
              New employee
            </CardTitle>
            <CardDescription>
              Add an authorized employee account. Their password is stored securely and cannot be viewed again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm">
                <span className="font-medium">Full name</span>
                <Input
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium">Position</span>
                <Input
                  placeholder="Operations Manager"
                  value={form.position}
                  onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))}
                  required
                />
                <span className="text-xs text-muted-foreground">
                  Enter the employee&apos;s position manually. This is not a dropdown.
                </span>
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium">Email</span>
                <Input
                  type="email"
                  placeholder="jane@amolex.com"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium">Temporary password</span>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Role</span>
                  <Select
                    value={form.role}
                    onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </Select>
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Active</span>
                  <div className="flex h-11 items-center rounded-2xl border border-border bg-background/60 px-4">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, active: event.target.checked }))
                      }
                      className="h-4 w-4 accent-secondary"
                    />
                    <span className="ml-3 text-sm text-muted-foreground">Allow login immediately</span>
                  </div>
                </label>
              </div>

              {error ? (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              {message ? (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  {message}
                </div>
              ) : null}

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create employee"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered employees</CardTitle>
            <CardDescription>
              These are the accounts that can sign in to the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employees.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-background/50 p-6 text-sm text-muted-foreground">
                No employee accounts have been created yet.
              </div>
            ) : (
              employees.map((employee) => (
                <div
                  key={employee.id}
                  className="rounded-[1.5rem] border border-border/70 bg-background/60 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <Avatar className="h-12 w-12 border border-border/70">
                        <AvatarImage src={employee.photoUrl ?? undefined} />
                        <AvatarFallback>
                          {employee.name
                            .split(/\s+/)
                            .map((part) => part[0] || "")
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-lg font-semibold">{employee.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{employee.email}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {employee.isSystem ? (
                        <Badge className="border-amber-200 bg-amber-50 text-amber-700">System admin</Badge>
                      ) : null}
                      <Badge className="border-blue-200 bg-blue-50 text-blue-700">{employee.role}</Badge>
                      <Badge className="border-amber-200 bg-amber-50 text-amber-700">{employee.position}</Badge>
                      <Badge
                        className={
                          employee.active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-800"
                        }
                      >
                        {employee.active ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </div>

                  {employee.isSystem ? (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Bootstrap admin account loaded from environment variables. It is shown here for visibility,
                      but its credentials come from <code>.env.local</code>.
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <p>Created: {new Date(employee.createdAt).toLocaleString()}</p>
                      <p>Updated: {new Date(employee.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
