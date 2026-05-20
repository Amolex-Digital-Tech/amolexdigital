import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getEmployeeByEmail, updateEmployeePhoto } from "@/lib/employee-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employee = await getEmployeeByEmail(email);
    if (!employee) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error loading admin profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const rawPhotoUrl = body.photoUrl;
    const photoUrl =
      typeof rawPhotoUrl === "string"
        ? rawPhotoUrl.trim() || null
        : rawPhotoUrl === null
          ? null
          : undefined;

    if (typeof photoUrl === "undefined") {
      return NextResponse.json({ error: "Photo URL is required." }, { status: 400 });
    }

    const employee = await updateEmployeePhoto(email, photoUrl);

    return NextResponse.json({
      success: true,
      employee
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
