import NextAuthImport from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "./auth.config";

const NextAuth = NextAuthImport as any;

export type AuthContextType = {
  user: {
    id: string;
    email?: string;
    name?: string;
    role?: string;
    position?: string | null;
    photoUrl?: string | null;
  };
  tenantId: string | null;
};

type AuthorizedAccount = {
  email: string;
  password: string;
  name: string;
  role: "admin" | "employee";
  position: string;
  photoUrl?: string | null;
  tenantId?: string | null;
};

function readAuthorizedAccounts(): AuthorizedAccount[] {
  const accounts: AuthorizedAccount[] = [];

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    accounts.push({
      email: adminEmail,
      password: adminPassword,
      name: "Admin User",
      role: "admin",
      position: "Administrator",
      photoUrl: null,
      tenantId: null
    });
  }

  const rawEmployees = process.env.AUTHORIZED_EMPLOYEES_JSON;
  if (!rawEmployees) {
    return accounts;
  }

  try {
    const parsed = JSON.parse(rawEmployees) as Array<{
      email?: string;
      password?: string;
      name?: string;
      role?: "admin" | "employee";
      position?: string;
      photoUrl?: string | null;
      tenantId?: string | null;
    }>;

    for (const employee of parsed) {
      const email = employee.email?.trim();
      const password = employee.password;
      if (!email || !password) {
        continue;
      }

      accounts.push({
        email,
        password,
        name: employee.name?.trim() || email,
        role: employee.role || "employee",
        position: employee.position?.trim() || (employee.role === "admin" ? "Administrator" : "Employee"),
        photoUrl: employee.photoUrl ?? null,
        tenantId: employee.tenantId ?? null
      });
    }
  } catch (error) {
    console.error("Failed to parse AUTHORIZED_EMPLOYEES_JSON", error);
  }

  return accounts;
}

async function getAdminFallback(email: string, password: string): Promise<AuthorizedAccount | null> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return null;
  }

  if (email !== adminEmail || password !== adminPassword) {
    return null;
  }

  const { getSystemAdminEmployee } = await import("./employee-auth");
  const systemAdmin = await getSystemAdminEmployee();

  return {
    email: adminEmail,
    password: adminPassword,
    name: systemAdmin?.name ?? "Admin User",
    role: "admin",
    position: systemAdmin?.position ?? "Administrator",
    photoUrl: systemAdmin?.photoUrl ?? null,
    tenantId: null
  };
}

function toAuthContext(session: Session): AuthContextType {
  const user = session.user ?? {};
  const extendedUser = user as typeof user & { role?: string; tenantId?: string | null };

  return {
    user: {
      id: user.email ?? user.name ?? "authenticated-user",
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      role: extendedUser.role,
      position: extendedUser.position ?? null,
      photoUrl: extendedUser.photoUrl ?? null
    },
    tenantId: extendedUser.tenantId ?? null
  };
}

export const { handlers, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Employee credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const adminMatch = await getAdminFallback(email, password);
        if (adminMatch) {
          return {
            id: email,
            email: adminMatch.email,
            name: adminMatch.name,
            role: adminMatch.role,
            position: adminMatch.position,
            photoUrl: adminMatch.photoUrl ?? null,
            tenantId: adminMatch.tenantId ?? null
          };
        }

        const { authenticateEmployee } = await import("./employee-auth");
        const dbEmployee = await authenticateEmployee(email, password);
        if (dbEmployee) {
          return dbEmployee;
        }

        const match = readAuthorizedAccounts().find(
          (account) => account.email.trim().toLowerCase() === email && account.password === password
        );

        if (!match) {
          return null;
        }

        return {
          id: email,
          email: match.email,
          name: match.name,
          role: match.role,
          position: match.position,
          photoUrl: match.photoUrl ?? null,
          tenantId: match.tenantId ?? null
        };
      }
    })
  ]
});

export async function requireUserSession(): Promise<AuthContextType> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return toAuthContext(session);
}

export async function requireAdminSession(): Promise<AuthContextType> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/dashboard/admin/sign-in");
  }

  return toAuthContext(session);
}

export type AuthContext = AuthContextType & {
  session: {
    user: {
      id: string;
      email?: string;
      name?: string;
      role?: string;
      tenantId?: string | null;
      position?: string | null;
      photoUrl?: string | null;
    };
    expires_at?: number;
    access_token?: string;
    refresh_token?: string;
  };
  role: string;
};