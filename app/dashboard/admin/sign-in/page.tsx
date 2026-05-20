"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession, signIn } from "next-auth/react";
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email, 
      password,
      callbackUrl: "/dashboard/admin"
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    const currentSession = await getSession();
    const sessionUser = currentSession?.user as
      | {
          email?: string;
          role?: string;
          position?: string | null;
          photoUrl?: string | null;
        }
      | undefined;

    localStorage.setItem(
      "admin_session",
      JSON.stringify({
        email: sessionUser?.email ?? email,
        role: sessionUser?.role ?? "authorized",
        position: sessionUser?.position ?? null,
        photoUrl: sessionUser?.photoUrl ?? null,
        loginTime: new Date().toISOString()
      })
    );

    if (sessionUser?.role === "employee" && !sessionUser?.photoUrl) {
      router.push("/dashboard/admin/settings?onboarding=photo");
    } else {
      router.push("/dashboard/admin");
    }
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative w-40 h-16 mx-auto">
              <Image 
                src="/amolex-logo.jpg" 
                alt="Amolex" 
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Amolex</h2>
              <p className="text-slate-700">Employee access for the admin dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                  <Input
                    type="email"
                    placeholder="employee@amolex.com"
                    className="pl-12 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-600 focus:border-amber-500 focus:ring-amber-500/20"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-600 focus:border-amber-500 focus:ring-amber-500/20"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              {/* Submit */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Helper */}
            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                Authorized employees only. Your activity is logged.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-slate-600">
            © 2026 Amolex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
