import { createSupabaseServerClient } from "./supabase/server";

export type ClientReport = {
  id: string;
  tenant_id: string;
  title: string;
  report_type: string;
  period_start: string | null;
  period_end: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

export type SocialAccount = {
  id: string;
  tenant_id: string;
  provider: string;
  account_handle: string;
  external_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type SocialPost = {
  id: number;
  tenant_id: string;
  social_account_id: string;
  posted_at: string;
  content: string | null;
  external_id: string | null;
  metrics: Record<string, unknown>;
  raw: Record<string, unknown>;
  created_at: string;
};

export type DashboardStats = {
  totalReports: number;
  totalSocialAccounts: number;
  totalPosts: number;
  totalImpressions: number;
  totalClicks: number;
  totalLikes: number;
};

// Fetch all reports for the client's tenant
export async function getClientReports(tenantId: string): Promise<ClientReport[]> {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching reports:", error);
    return [];
  }

  return data ?? [];
}

// Fetch social accounts for the client's tenant
export async function getClientSocialAccounts(tenantId: string): Promise<SocialAccount[]> {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching social accounts:", error);
    return [];
  }

  return data ?? [];
}

// Fetch recent posts for the client's tenant
export async function getClientPosts(tenantId: string, limit = 10): Promise<SocialPost[]> {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("posted_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data ?? [];
}

// Get dashboard stats for the client
export async function getClientStats(tenantId: string): Promise<DashboardStats> {
  const supabase = createSupabaseServerClient();
  
  // Get counts
  const [reportsCount, accountsCount, postsCount] = await Promise.all([
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("social_accounts").select("*", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("social_posts").select("*", { count: "exact", head: true }).eq("tenant_id", tenantId)
  ]);

  // Get aggregate metrics from posts
  const { data: posts } = await supabase
    .from("social_posts")
    .select("metrics")
    .eq("tenant_id", tenantId);

  let totalImpressions = 0;
  let totalClicks = 0;
  let totalLikes = 0;

  posts?.forEach((post) => {
    const metrics = post.metrics as Record<string, unknown>;
    totalImpressions += Number(metrics?.impressions ?? 0);
    totalClicks += Number(metrics?.clicks ?? 0);
    totalLikes += Number(metrics?.likes ?? 0);
  });

  return {
    totalReports: reportsCount.count ?? 0,
    totalSocialAccounts: accountsCount.count ?? 0,
    totalPosts: postsCount.count ?? 0,
    totalImpressions,
    totalClicks,
    totalLikes
  };
}

// Fetch tenant info
export async function getTenantInfo(tenantId: string) {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();

  if (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }

  return data;
}