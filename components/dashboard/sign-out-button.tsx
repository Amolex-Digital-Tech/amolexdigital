"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  redirectTo?: string;
  showLabel?: boolean;
};

export function SignOutButton({
  className,
  variant = "secondary",
  size = "default",
  redirectTo = "/dashboard/sign-in",
  showLabel = true
}: Props) {
  const router = useRouter();

  async function handleSignOut() {
    // Clear both dashboard session flavors so the next visit starts cleanly.
    localStorage.removeItem("admin_session");
    localStorage.removeItem("client_session");
    localStorage.removeItem("user_company_name");

    await signOut({ redirect: false });

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
      aria-label={showLabel ? undefined : "Sign out"}
      title={showLabel ? undefined : "Sign out"}
    >
      <LogOut className="h-4 w-4" />
      {showLabel ? "Sign out" : null}
    </Button>
  );
}
