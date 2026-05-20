import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const schema = process.env.SUPABASE_SCHEMA || "public";
  return createClient(url, key, { db: { schema } });
}

// GET - Fetch all clients
export async function GET() {
  try {
    const serviceClient = getServiceClient();
    
    // Get all tenants from Supabase
    const { data: tenants, error } = await serviceClient
      .from("clients")
      .select("id, company_name, email, created_at, status")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tenants:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ clients: tenants ?? [] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_name, password, email } = body;

    if (!company_name || !password || !email) {
      return NextResponse.json(
        { error: "Company name, email and password are required" },
        { status: 400 }
      );
    }

    const serviceClient = getServiceClient();
    
    // Use provided email
    const clientEmail = email;
    
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email: clientEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        company: company_name
      }
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Failed to create user: " + authError.message },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Insert into clients table for bot usage
    await serviceClient
      .from("clients")
      .insert({
        company_name,
        email: clientEmail,
        supabase_user_id: authData.user.id,
        status: "active"
      });

    return NextResponse.json({
      success: true,
      client: {
        id: authData.user.id,
        company_name: company_name,
        email: clientEmail,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
