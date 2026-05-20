"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Lock, Building, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const companyKey = companyName.toLowerCase().trim().replace(/\s/g, '');
    const storedClient = localStorage.getItem(`client_${companyKey}`);
    
    if (storedClient) {
      const clientData = JSON.parse(storedClient);
      if (clientData.password === password) {
        localStorage.setItem("client_session", JSON.stringify({
          companyName: companyName.trim(),
          loginTime: new Date().toISOString()
        }));
        localStorage.setItem("user_company_name", companyName.trim());
        // Set cookie for server components
        document.cookie = `user_company_name=${encodeURIComponent(companyName.trim())}; path=/; max-age=86400`;
        setLoading(false);
        router.push("/dashboard/client");
        router.refresh();
        return;
      } else {
        setLoading(false);
        setError("Invalid password. Please check your credentials and try again.");
        return;
      }
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: sessionData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: `${companyName.toLowerCase().trim()}@amolex.client`, 
        password 
      });

      setLoading(false);

      if (authError) {
        console.error("Auth error:", authError);
        setError("Login failed: " + authError.message + ". Make sure you're using the company name and password from admin registration.");
        return;
      }

      // Store credentials and session for client dashboard
      localStorage.setItem(`client_${companyKey}`, JSON.stringify({
        password: password,
        email: `${companyName.toLowerCase().trim()}@amolex.client`,
        supabaseUserId: sessionData?.user?.id
      }));
      localStorage.setItem("user_company_name", companyName.trim());
      
      // Also set a cookie for server component access
      document.cookie = `user_company_name=${encodeURIComponent(companyName.trim())}; path=/; max-age=86400`;
      
      router.push("/dashboard/client");
      router.refresh();
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image 
                src="/amolex-logo-new.png" 
                alt="Amolex" 
                width={200}
                height={70}
                className="object-contain"
              />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Amolex Client Portal</h2>
              <p className="text-slate-500">Sign in to access your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Enter your company name"
                    className="pl-12 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20"
                    required
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              <p className="text-slate-500 text-sm">
                Don&#39;t have access?{' '}
                <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
                  Contact our team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-slate-400">
            © 2026 Amolex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
