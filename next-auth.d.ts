import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: string;
      tenantId?: string | null;
      position?: string | null;
      photoUrl?: string | null;
    };
  }

  interface User {
    role?: string;
    tenantId?: string | null;
    position?: string | null;
    photoUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    tenantId?: string | null;
    position?: string | null;
    photoUrl?: string | null;
  }
}
