import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/dashboard/admin/sign-in" },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId ?? null;
        token.position = (user as any).position ?? null;
        token.photoUrl = (user as any).photoUrl ?? null;
      }
      if (trigger === "update" && session?.user) {
        const u = session.user as any;
        if (typeof u.position !== "undefined") token.position = u.position ?? null;
        if (typeof u.photoUrl !== "undefined") token.photoUrl = u.photoUrl ?? null;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        const u = session.user as any;
        u.role = token.role;
        u.tenantId = token.tenantId ?? null;
        u.position = token.position ?? null;
        u.photoUrl = token.photoUrl ?? null;
      }
      return session;
    }
  }
};