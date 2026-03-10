import { NextRequest, NextResponse } from "next/server";

// Serves a single assessment row for the results page when localStorage
// doesn't have the data (e.g. user opens the link in a different browser).

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // DB not configured — client should rely on localStorage instead.
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  try {
    const { createServerClient } = await import("@/lib/supabase");
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("assessment_responses")
      .select(
        "id, email, created_at, pace_demand, pace_capacity, ambiguity_demand, ambiguity_capacity, relational_demand, relational_capacity, novelty_demand, novelty_capacity, narrative_peak, narrative_friction"
      )
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
