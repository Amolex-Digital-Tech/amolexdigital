"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Lock, Building, AlertCircle, Loader2 } from "lucide-react";

export function SignInForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const companyKey = companyName.toLowerCase().trim().replace(/\s/g, '_');
    
    // Check if client exists in localStorage (admin-created accounts)
    const storedClient = localStorage.getItem(`client_${companyKey}`);
    
    if (storedClient) {
      // Validate against stored credentials
      const clientData = JSON.parse(storedClient);
      if (clientData.password === password) {
        // Store session for client
        localStorage.setItem("client_session", JSON.stringify({
          companyName: companyName.trim(),
          loginTime: new Date().toISOString()
        }));
        
        // Also store in user_company_name for dashboard
        localStorage.setItem("user_company_name", companyName.trim());
        
        setLoading(false);
        router.push("/dashboard/client");
        router.refresh();
        return;
      }
    }

    // Fallback: Try Supabase auth (for existing users)
    const { error: authError } = await supabase.auth.signInWithPassword({ 
      email: `${companyName.toLowerCase().trim()}@amolex.client`, 
      password 
    });

    setLoading(false);

    if (authError) {
      setError("Invalid company name or password. Please check your credentials.");
      return;
    }

    // Store company name for session
    localStorage.setItem("user_company_name", companyName.trim());
    
    router.push("/dashboard/client");
    router.refresh();
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="mx-auto w-full max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-secondary">Dashboard Access</p>
        <h1 className="mt-4 font-heading text-3xl font-semibold">Client Login</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Enter your company name and password to access your dashboard. 
          Contact Amolex if you don&#39;t have login credentials.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="company"
              type="text"
              placeholder="Company Name"
              className="pl-10"
              required
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              minLength={1}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? (
            <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
