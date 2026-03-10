-- ─────────────────────────────────────────────────────────────────────────────
-- FOUNDER FIT — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension (already enabled on most Supabase projects)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Main table ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessment_responses (

  -- Identity
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Contact & consent
  email         TEXT    NOT NULL,
  gdpr_consent  BOOLEAN NOT NULL,

  -- ── Dimension sliders (0–10) ──────────────────────────────────────────────
  -- Dimension 01: Pace & Intensity
  pace_demand     SMALLINT NOT NULL CHECK (pace_demand     BETWEEN 0 AND 10),
  pace_capacity   SMALLINT NOT NULL CHECK (pace_capacity   BETWEEN 0 AND 10),

  -- Dimension 02: Uncertainty / Ambiguity Load
  ambiguity_demand    SMALLINT NOT NULL CHECK (ambiguity_demand    BETWEEN 0 AND 10),
  ambiguity_capacity  SMALLINT NOT NULL CHECK (ambiguity_capacity  BETWEEN 0 AND 10),

  -- Dimension 03: Relational Load
  relational_demand   SMALLINT NOT NULL CHECK (relational_demand   BETWEEN 0 AND 10),
  relational_capacity SMALLINT NOT NULL CHECK (relational_capacity BETWEEN 0 AND 10),

  -- Dimension 04: Novelty vs Structure
  novelty_demand    SMALLINT NOT NULL CHECK (novelty_demand    BETWEEN 0 AND 10),
  novelty_capacity  SMALLINT NOT NULL CHECK (novelty_capacity  BETWEEN 0 AND 10),

  -- ── Narrative responses (optional) ───────────────────────────────────────
  narrative_peak      TEXT,
  narrative_friction  TEXT,

  -- ── Computed friction zones (stored for reporting) ───────────────────────
  zone_cognitive_score    SMALLINT CHECK (zone_cognitive_score    BETWEEN 0 AND 10),
  zone_operational_score  SMALLINT CHECK (zone_operational_score  BETWEEN 0 AND 10),
  zone_relational_score   SMALLINT CHECK (zone_relational_score   BETWEEN 0 AND 10),

  zone_cognitive_level    TEXT CHECK (zone_cognitive_level    IN ('low', 'medium', 'high')),
  zone_operational_level  TEXT CHECK (zone_operational_level  IN ('low', 'medium', 'high')),
  zone_relational_level   TEXT CHECK (zone_relational_level   IN ('low', 'medium', 'high')),

  -- ── Email tracking ────────────────────────────────────────────────────────
  email_sent      BOOLEAN     DEFAULT FALSE,
  email_sent_at   TIMESTAMPTZ
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_assessment_responses_email
  ON assessment_responses (email);

CREATE INDEX IF NOT EXISTS idx_assessment_responses_created_at
  ON assessment_responses (created_at DESC);

-- ─── Row-level security ───────────────────────────────────────────────────────
-- Only the service role key (server-side) can insert/read rows.
-- The anon key (public browser) is blocked.

ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- Allow the service role full access (used by the Next.js API route)
CREATE POLICY "Service role can do everything"
  ON assessment_responses
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Block all public access
CREATE POLICY "No public access"
  ON assessment_responses
  FOR ALL
  TO anon
  USING (false);

-- ─── Verification query ───────────────────────────────────────────────────────
-- Run this after setup to confirm the table exists:
--
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'assessment_responses'
-- ORDER BY ordinal_position;
