import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createEmployee, listEmployees } from "@/lib/employee-auth";

export const dynamic = "force-dynamic";

type PortalSessionUser = {
  email?: string | null;
  role?: string | null;
};

function isAdmin(session: Awaited<ReturnType<typeof auth>> | null) {
  const sessionUser = session?.user as PortalSessionUser | undefined;
  return Boolean(sessionUser?.email) && sessionUser?.role === "admin";
}

export async function GET() {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await listEmployees();
    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const position = String(body.position ?? "").trim();
    const role = body.role === "admin" ? "admin" : "employee";
    const photoUrl = typeof body.photoUrl === "string" ? body.photoUrl.trim() || null : null;
    const tenantId = typeof body.tenantId === "string" ? body.tenantId.trim() || null : null;
    const active = body.active !== false;

    if (!name || !email || !password || !position) {
      return NextResponse.json(
        { error: "Name, email, password, and position are required." },
        { status: 400 }
      );
    }

    const employee = await createEmployee({
      name,
      email,
      password,
      role,
      position,
      photoUrl,
      tenantId,
      active
    });

    return NextResponse.json(
      {
        success: true,
        employee
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
