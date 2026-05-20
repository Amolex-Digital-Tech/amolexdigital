"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell,
  Building2,
  Clock3,
  KeyRound,
  Mail,
  Palette,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type ThemePreference = "system" | "light" | "dark";

type AdminSettings = {
  portalName: string;
  supportEmail: string;
  timezone: string;
  businessHours: string;
  emailAlerts: boolean;
  taskReminders: boolean;
  leadAlerts: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
  theme: ThemePreference;
};

type PortalSessionUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  position?: string | null;
  photoUrl?: string | null;
};

const STORAGE_KEY = "amolex:admin-settings";

const DEFAULT_SETTINGS: AdminSettings = {
  portalName: "Amolex Admin Portal",
  supportEmail: "support@amolex.tech",
  timezone: "Africa/Addis_Ababa",
  businessHours: "Mon - Fri, 8:30 AM - 5:30 PM",
  emailAlerts: true,
  taskReminders: true,
  leadAlerts: true,
  weeklyDigest: false,
  securityAlerts: true,
  theme: "dark"
};

const TIMEZONES = [
  "Africa/Addis_Ababa",
  "Africa/Nairobi",
  "UTC",
  "Europe/London",
  "America/New_York",
  "Asia/Dubai"
];

function loadStoredSettings(): AdminSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<AdminSettings>;
    const theme =
      parsed.theme === "system" || parsed.theme === "light" || parsed.theme === "dark"
        ? parsed.theme
        : DEFAULT_SETTINGS.theme;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      theme
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function readLoginTime(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem("admin_session");
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { loginTime?: string };
    return parsed.loginTime ?? null;
  } catch {
    return null;
  }
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return "Unavailable";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return date.toLocaleString();
}

function SettingSwitch({
  checked,
  label,
  description,
  onChange
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-[0_8px_24px_rgba(37,99,235,0.04)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600"
      />
      <span className="space-y-1">
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="block text-sm leading-6 text-slate-700">{description}</span>
      </span>
    </label>
  );
}

export default function AdminSettingsPage() {
  const { data: session, status, update } = useSession();
  const searchParams = useSearchParams();
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [draftPhoto, setDraftPhoto] = useState<string | null>(null);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const isProfileOnboarding = searchParams.get("onboarding") === "photo";
  const sessionUser = session?.user as PortalSessionUser | undefined;
  const isAdmin = sessionUser?.role === "admin";
  const profileName = sessionUser?.name?.trim() || "Admin User";
  const profileEmail = sessionUser?.email?.trim() || "admin@amolex.tech";
  const profilePosition = sessionUser?.position?.trim() || (isAdmin ? "System admin" : "Employee");
  const profilePhoto = sessionUser?.photoUrl ?? null;
  const profileInitials = (profileName || profileEmail)
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";
  const currentProfilePhoto = draftPhoto ?? profilePhoto;

  useEffect(() => {
    const stored = loadStoredSettings();
    setSettings(stored);
    setLastSavedAt(
      typeof window === "undefined" ? null : window.localStorage.getItem(`${STORAGE_KEY}:savedAt`)
    );
    setLoginTime(readLoginTime());
    setTheme(stored.theme);
    setReady(true);
  }, [setTheme]);

  function updateSetting<K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) {
    setMessage(null);
    setSettings((current) => ({
      ...current,
      [key]: value
    }));
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      const savedAt = new Date().toISOString();
      window.localStorage.setItem(`${STORAGE_KEY}:savedAt`, savedAt);
      setLastSavedAt(savedAt);
      setMessage("Settings saved locally in this browser.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(`${STORAGE_KEY}:savedAt`);
    setSettings(DEFAULT_SETTINGS);
    setTheme(DEFAULT_SETTINGS.theme);
    setLastSavedAt(null);
    setMessage("Settings reset to the default Amolex values.");
  }

  function readPhotoFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Unable to read the selected image."));
        }
      };
      reader.onerror = () => reject(new Error("Unable to read the selected image."));
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }

    setPhotoError(null);
    setPhotoMessage(null);
    try {
      const dataUrl = await readPhotoFile(file);
      setDraftPhoto(dataUrl);
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Unable to load the selected image.");
    }
  }

  async function persistProfilePhoto(photoUrl: string | null, successMessage: string) {
    setPhotoSaving(true);
    setPhotoError(null);
    setPhotoMessage(null);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ photoUrl })
      });

      const result = await response.json();

      if (!response.ok) {
        setPhotoError(result.error ?? "Unable to update your profile photo.");
        return;
      }

      let loginTime = new Date().toISOString();
      try {
        const storedSession = window.localStorage.getItem("admin_session");
        if (storedSession) {
          const parsed = JSON.parse(storedSession) as { loginTime?: string };
          loginTime = parsed.loginTime ?? loginTime;
        }
      } catch {
        loginTime = new Date().toISOString();
      }

      window.localStorage.setItem(
        "admin_session",
        JSON.stringify({
          email: profileEmail,
          role: sessionUser?.role ?? "authorized",
          position: sessionUser?.position ?? null,
          photoUrl,
          loginTime
        })
      );

      await update({
        user: {
          photoUrl: result.employee.photoUrl ?? null
        }
      });

      setDraftPhoto(null);
      setPhotoMessage(successMessage);
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Unable to update your profile photo.");
    } finally {
      setPhotoSaving(false);
    }
  }

  async function handleSavePhoto() {
    await persistProfilePhoto(draftPhoto, "Your profile photo has been saved.");
  }

  async function handleClearPhoto() {
    await persistProfilePhoto(null, "Your profile photo has been removed.");
  }

  const currentEmail = session?.user?.email ?? "admin@amolex.tech";
  const currentName = session?.user?.name ?? "Admin User";
  const currentRole = sessionUser?.role === "admin" ? "System admin" : "Authorized employee";
  const sessionState = status === "loading" ? "Checking session" : status === "authenticated" ? "Session active" : "Signed out";

  return (
    <div className="container py-12">
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-r from-white via-blue-50/60 to-white px-6 py-6 shadow-[0_18px_55px_rgba(37,99,235,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.12),transparent_26%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-500">Admin settings</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-slate-900">
              Workspace, security, and session controls
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-800">
              Keep the admin portal organized, manage notification preferences, and control how this browser
              behaves while you are signed in.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isAdmin ? (
              <Button asChild variant="outline" className="border-blue-100 bg-white text-slate-900 hover:bg-blue-50">
                <Link href="/dashboard/admin/employees">
                  <Users className="h-4 w-4" />
                  Manage employees
                </Link>
              </Button>
            ) : null}
            <SignOutButton
              redirectTo="/dashboard/admin/sign-in"
              variant="outline"
              className="border-blue-100 bg-white text-slate-900 hover:bg-blue-50"
            />
          </div>
        </div>

        <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-white/85 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-600">Session</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{sessionState}</p>
            <p className="mt-1 text-sm text-slate-700">{currentEmail}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white/85 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-600">Theme</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{settings.theme}</p>
            <p className="mt-1 text-sm text-slate-700">Applied through the portal theme manager.</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white/85 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-600">Last saved</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{formatDateTime(lastSavedAt)}</p>
            <p className="mt-1 text-sm text-slate-700">Local browser preferences only.</p>
          </div>
        </div>
      </div>

      <Card className={`mt-8 border-blue-100 ${isProfileOnboarding && !profilePhoto ? "border-amber-200 bg-amber-50/70" : ""}`}>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Profile photo</CardTitle>
              <CardDescription>
                Upload an image so the admin portal can show your picture across the workspace.
              </CardDescription>
            </div>
            {isProfileOnboarding && !profilePhoto ? (
              <Badge className="border-amber-200 bg-amber-100 text-amber-700">Setup required</Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar className="h-24 w-24 border-2 border-blue-100 bg-white shadow-sm">
            <AvatarImage src={currentProfilePhoto ?? undefined} />
            <AvatarFallback className="text-xl font-semibold text-blue-700">{profileInitials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-600">Profile</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{profileName}</h2>
              <p className="mt-1 text-sm text-slate-700">{profilePosition}</p>
              <p className="mt-1 text-sm text-slate-600">{profileEmail}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <Input type="file" accept="image/*" onChange={handlePhotoChange} className="bg-white" />
              <Button
                type="button"
                onClick={handleSavePhoto}
                disabled={!draftPhoto || photoSaving}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {photoSaving ? "Saving..." : "Save photo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearPhoto}
                disabled={photoSaving || !profilePhoto}
                className="border-blue-100 bg-white text-slate-900 hover:bg-blue-50"
              >
                Remove photo
              </Button>
            </div>

            <p className="text-sm leading-6 text-slate-700">
              Your photo appears in the admin sidebar, the dashboard header, and employee cards. You can upload
              a new image any time.
            </p>

            {photoError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {photoError}
              </div>
            ) : null}

            {photoMessage ? (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {photoMessage}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Signed-in identity and access controls.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="border-blue-200 bg-blue-100 text-blue-700">{sessionState}</Badge>
                  <Badge className="border-blue-200 bg-blue-100 text-blue-700">{currentRole}</Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-800">
                  <p>
                    <span className="font-medium text-slate-900">Name:</span> {currentName}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Email:</span> {currentEmail}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Login time:</span> {formatDateTime(loginTime)}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-700">
                To change employee credentials, use the employee manager. This settings page controls portal
                behavior, not the underlying login account.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Organization</CardTitle>
                  <CardDescription>Branding and support contact details.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-slate-900">Portal name</span>
                <Input
                  value={settings.portalName}
                  onChange={(event) => updateSetting("portalName", event.target.value)}
                  placeholder="Amolex Admin Portal"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium text-slate-900">Support email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                  <Input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(event) => updateSetting("supportEmail", event.target.value)}
                    className="pl-11"
                    placeholder="support@amolex.tech"
                  />
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-slate-900">Timezone</span>
                  <Select
                    value={settings.timezone}
                    onChange={(event) => updateSetting("timezone", event.target.value)}
                  >
                    {TIMEZONES.map((timezone) => (
                      <option key={timezone} value={timezone}>
                        {timezone}
                      </option>
                    ))}
                  </Select>
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-slate-900">Business hours</span>
                  <Input
                    value={settings.businessHours}
                    onChange={(event) => updateSetting("businessHours", event.target.value)}
                    placeholder="Mon - Fri, 8:30 AM - 5:30 PM"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose which admin alerts stay visible here.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <SettingSwitch
                checked={settings.emailAlerts}
                label="Email alerts"
                description="Notify me about major portal events and updates."
                onChange={(value) => updateSetting("emailAlerts", value)}
              />
              <SettingSwitch
                checked={settings.taskReminders}
                label="Task reminders"
                description="Surface reminders for overdue tasks and deadlines."
                onChange={(value) => updateSetting("taskReminders", value)}
              />
              <SettingSwitch
                checked={settings.leadAlerts}
                label="Lead follow-ups"
                description="Highlight leads that need quick attention."
                onChange={(value) => updateSetting("leadAlerts", value)}
              />
              <SettingSwitch
                checked={settings.weeklyDigest}
                label="Weekly digest"
                description="Bundle portal activity into a weekly summary."
                onChange={(value) => updateSetting("weeklyDigest", value)}
              />
              <SettingSwitch
                checked={settings.securityAlerts}
                label="Security alerts"
                description="Notify me when important login activity occurs."
                onChange={(value) => updateSetting("securityAlerts", value)}
              />
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Adjust how the admin portal looks in this browser.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-slate-900">Theme</span>
                <Select
                  value={settings.theme}
                  onChange={(event) => {
                    const nextTheme = event.target.value as ThemePreference;
                    updateSetting("theme", nextTheme);
                    setTheme(nextTheme);
                  }}
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </label>

              <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Theme behavior</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      The selected theme is applied immediately through the portal theme provider and is stored
                      locally when you save.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Session guidance and credential management.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-white/80 p-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-blue-700" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Current login session</p>
                    <p className="text-sm text-slate-700">{formatDateTime(loginTime)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white/80 p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-700" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Employee credentials</p>
                    <p className="text-sm leading-6 text-slate-700">
                      Use the employee manager to create, disable, or update admin logins.
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full border-blue-100 bg-white text-slate-900 hover:bg-blue-50">
                <Link href="/dashboard/admin/employees">Open employee manager</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-blue-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Danger zone</CardTitle>
                <CardDescription>Reset only the local preferences stored in this browser.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-slate-700">
              Resetting clears the admin portal preferences saved in this browser. It does not remove employees,
              sessions, or any data stored in the database.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="border-blue-100 bg-white text-slate-900 hover:bg-blue-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reset defaults
              </Button>
              <Button type="submit" disabled={!ready || saving} className="bg-blue-600 text-white hover:bg-blue-700">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {message && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
