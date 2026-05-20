import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const DEFAULT_PAGE_SIZE = 20;

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  
  // Pagination params
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = Math.min(
    parseInt(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE), 10),
    100 // Max 100 items per page
  );
  const offset = (page - 1) * limit;

  const tenantId = (session.user as typeof session.user & { tenantId?: string | null }).tenantId ?? null;

  if (!tenantId) {
    return NextResponse.json({ error: "No tenant assigned to this user." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  
  // Fetch total count for pagination info
  const { count } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  // Fetch paginated data
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit)
    }
  });
}
