import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
  const { nextUrl } = req;
  const isSignInPage = nextUrl.pathname === "/dashboard/admin/sign-in";
  const isAdminPath = nextUrl.pathname.startsWith("/dashboard/admin");

  if (!isAdminPath) return NextResponse.next();

  if (req.auth?.user?.email && isSignInPage) {
    return NextResponse.redirect(new URL("/dashboard/admin", nextUrl.origin));
  }

  if (!req.auth?.user?.email && !isSignInPage) {
    const signInUrl = new URL("/dashboard/admin/sign-in", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", `${nextUrl.pathname}${nextUrl.search}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/admin/:path*"]
};