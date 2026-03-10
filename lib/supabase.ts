import { createClient } from "@supabase/supabase-js";

// Public client — safe for browser use (read-only on protected tables)
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createClient(url, key);
}

// Server client — uses service role key, never expose to browser
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key);
}

// Database row type — matches schema.sql
export interface AssessmentRow {
  id: string;
  created_at: string;
  email: string;
  gdpr_consent: boolean;
  pace_demand: number;
  pace_capacity: number;
  ambiguity_demand: number;
  ambiguity_capacity: number;
  relational_demand: number;
  relational_capacity: number;
  novelty_demand: number;
  novelty_capacity: number;
  narrative_peak: string | null;
  narrative_friction: string | null;
  zone_cognitive_score: number;
  zone_operational_score: number;
  zone_relational_score: number;
  zone_cognitive_level: "low" | "medium" | "high";
  zone_operational_level: "low" | "medium" | "high";
  zone_relational_level: "low" | "medium" | "high";
  email_sent: boolean;
  email_sent_at: string | null;
}
