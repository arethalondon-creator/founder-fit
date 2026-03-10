"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  computeFrictionZones,
  FrictionZone,
  SliderValues,
  LEVEL_COLORS,
  LEVEL_LABELS,
  getGapColor,
  GeneratedInsights,
  ZoneInsight,
} from "@/lib/scoring";
import { DIMENSIONS } from "@/lib/dimensions";
import { S } from "@/lib/styles";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ResultData extends SliderValues {
  id: string;
  email: string;
  created_at: string;
  narrative_peak: string | null;
  narrative_friction: string | null;
}

// ─── Zone card ────────────────────────────────────────────────────────────────

function ZoneCard({
  zone,
  index,
  aiInsight,
  generating,
}: {
  zone: FrictionZone;
  index: number;
  aiInsight: ZoneInsight | null;
  generating: boolean;
}) {
  const color = LEVEL_COLORS[zone.level];
  const isLoading = generating && !aiInsight;

  // Use AI text when available, static fallback while loading or on error
  const insight = aiInsight?.insight ?? zone.insight;
  const redesign = aiInsight?.redesignDirection ?? zone.redesignDirection;

  return (
    <div style={{ border: S.border, padding: "32px", marginBottom: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ ...S.labelLight, marginBottom: "8px" }}>
            *FRICTION ZONE {String(index + 1).padStart(2, "0")}
          </div>
          <h3 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "#344e41", lineHeight: 1 }}>
            {zone.name}
          </h3>
        </div>
        <div style={{ border: `1px solid ${color}`, padding: "6px 14px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color, whiteSpace: "nowrap" }}>
          {LEVEL_LABELS[zone.level]}
        </div>
      </div>

      {/* Score + bar */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px" }}>
          <span style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1, color }}>{zone.score}</span>
          <span style={{ fontSize: "0.8rem", color: "#a3b18a", fontWeight: 500 }}>/ 10</span>
        </div>
        <div style={{ height: "4px", backgroundColor: "rgba(52,78,65,0.12)", width: "100%" }}>
          <div style={{ height: "100%", width: `${(zone.score / 10) * 100}%`, backgroundColor: color }} />
        </div>
      </div>

      {/* Insight text — transitions smoothly from static → AI */}
      <div style={{ opacity: isLoading ? 0.45 : 1, transition: "opacity 0.4s ease" }}>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "#3a5a40", marginBottom: "24px" }}>
          {insight}
        </p>

        <div style={{ borderTop: "1px solid rgba(52,78,65,0.15)", paddingTop: "20px" }}>
          <div style={{ ...S.labelLight, marginBottom: "10px" }}>REDESIGN DIRECTION</div>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "#344e41" }}>
            {redesign}
          </p>
        </div>
      </div>

      {/* Generating indicator — visible only while AI is working */}
      {isLoading && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", opacity: 0.6 }}>
          <div style={{ width: "80px", height: "2px", backgroundColor: "rgba(52,78,65,0.15)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "50%", backgroundColor: "#588157", animation: "slide 1s ease-in-out infinite" }} />
          </div>
          <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "#588157" }}>
            Generating insight…
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Slider summary row ───────────────────────────────────────────────────────

function SliderSummaryRow({ label, demand, capacity }: { label: string; demand: number; capacity: number }) {
  const gapScore = Math.abs(demand - capacity);
  const demandPct = (demand / 10) * 100;
  const capacityPct = (capacity / 10) * 100;
  const left = Math.min(demandPct, capacityPct);
  const width = Math.abs(demandPct - capacityPct);
  const gapColor = getGapColor(gapScore);

  return (
    <div style={{ paddingTop: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(52,78,65,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={S.label}>{label}</span>
        <div style={{ display: "flex", gap: "16px" }}>
          <span style={{ ...S.labelLight, color: "#588157" }}>D:{demand}</span>
          <span style={S.label}>C:{capacity}</span>
          <span style={{ ...S.label, color: gapColor }}>GAP:{gapScore}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: "4px", backgroundColor: "rgba(52,78,65,0.1)" }}>
        {width > 0 && (
          <div style={{ position: "absolute", left: `${left}%`, width: `${width}%`, height: "100%", backgroundColor: gapColor }} />
        )}
        <div style={{ position: "absolute", left: `${demandPct}%`, top: "-4px", transform: "translateX(-50%)", width: "3px", height: "12px", backgroundColor: "#588157" }} />
        <div style={{ position: "absolute", left: `${capacityPct}%`, top: "-4px", transform: "translateX(-50%)", width: "3px", height: "12px", backgroundColor: "#344e41" }} />
      </div>
    </div>
  );
}

// ─── Loading / not-found screens ─────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={{ backgroundColor: "#dad7cd", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: S.border }}>
        <Link href="/" style={{ ...S.label, textDecoration: "none" }}>FOUNDER_FIT</Link>
      </header>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={S.labelLight}>LOADING PROFILE…</div>
        <div style={{ width: "200px", height: "3px", backgroundColor: "rgba(52,78,65,0.15)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "40%", backgroundColor: "#588157", animation: "slide 1.2s ease-in-out infinite" }} />
        </div>
      </div>
      <style>{`@keyframes slide { 0%{margin-left:-40%} 100%{margin-left:100%} }`}</style>
    </div>
  );
}

function NotFoundScreen() {
  return (
    <div style={{ backgroundColor: "#dad7cd", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: S.border }}>
        <Link href="/" style={{ ...S.label, textDecoration: "none" }}>FOUNDER_FIT</Link>
      </header>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
        <div style={{ ...S.labelLight, marginBottom: "1.5rem" }}>*PROFILE NOT FOUND</div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#344e41", marginBottom: "1.5rem", lineHeight: 0.9 }}>
          RESULTS<br />UNAVAILABLE
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#588157", lineHeight: 1.6, marginBottom: "2rem" }}>
          This profile could not be found. It may have been completed in a different browser, or the link may be incorrect.
        </p>
        <Link href="/assessment" style={{ backgroundColor: "#344e41", color: "#dad7cd", padding: "0.85rem 1.75rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, display: "inline-block", textDecoration: "none" }}>
          Run the Instrument →
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // AI insight state — separate from result loading so both phases are clear
  const [aiInsights, setAiInsights] = useState<GeneratedInsights | null>(null);
  const [insightsGenerating, setInsightsGenerating] = useState(false);

  // ── Phase 1: Load result data (localStorage → DB fallback) ───────────────
  useEffect(() => {
    const { id } = params;

    try {
      const cached = localStorage.getItem(`ff-result-${id}`);
      if (cached) {
        setResult(JSON.parse(cached) as ResultData);
        setLoading(false);
        return;
      }
    } catch { /* localStorage unavailable */ }

    fetch(`/api/results/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not_found");
        return r.json();
      })
      .then((data: ResultData) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [params.id]);

  // ── Phase 2: Generate AI insights once result data is available ──────────
  // Fires immediately after Phase 1 resolves — result page renders with static
  // fallback text first, then transitions to personalised insights as they arrive.
  useEffect(() => {
    if (!result) return;

    setInsightsGenerating(true);

    fetch("/api/generate-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Pass the full result — slider values + narratives are all the model needs
      body: JSON.stringify(result),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`insights_failed: ${r.status}`);
        return r.json();
      })
      .then((insights: GeneratedInsights) => {
        setAiInsights(insights);
      })
      .catch((err) => {
        // Fail silently — static fallback text remains visible
        console.warn("Insight generation failed, using static fallback:", err.message);
      })
      .finally(() => {
        setInsightsGenerating(false);
      });
  }, [result]); // re-runs only if result identity changes (i.e., never after first load)

  if (loading) return <LoadingScreen />;
  if (notFound || !result) return <NotFoundScreen />;

  // Zones computed from slider values — provide scores, levels, and static fallback text
  const sliderValues: SliderValues = {
    pace_demand: result.pace_demand,
    pace_capacity: result.pace_capacity,
    ambiguity_demand: result.ambiguity_demand,
    ambiguity_capacity: result.ambiguity_capacity,
    relational_demand: result.relational_demand,
    relational_capacity: result.relational_capacity,
    novelty_demand: result.novelty_demand,
    novelty_capacity: result.novelty_capacity,
  };

  const zones = computeFrictionZones(sliderValues);
  const highCount = zones.filter((z) => z.level === "high").length;
  const date = new Date(result.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ backgroundColor: "#dad7cd", minHeight: "100vh" }}>
      <style>{`@keyframes slide { 0%{margin-left:-50%} 100%{margin-left:100%} }`}</style>

      {/* Nav */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: S.border }}>
        <Link href="/" style={{ ...S.label, textDecoration: "none" }}>FOUNDER_FIT</Link>
        <span style={S.labelLight}>YOUR PROFILE</span>
      </header>

      {/* Hero */}
      <section
        style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", borderBottom: S.border, minHeight: "50vh" }}
        className="results-hero-grid"
      >
        <div style={{ borderRight: S.border, padding: "2.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="results-hero-left">
          <div>
            <div style={{ ...S.labelLight, marginBottom: "1.5rem" }}>*PROFILE COMPLETE — {date}</div>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 800, lineHeight: 0.88, letterSpacing: "-0.05em", textTransform: "uppercase", color: "#344e41", marginBottom: "1.5rem" }}>
              FOUNDER<br />FIT<br />PROFILE
            </h1>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.55, color: "#588157", maxWidth: "420px" }}>
              This profile maps where the gap between your environment&apos;s demands and your cognitive
              capacity is creating structural friction. It is not a diagnosis — it is a map.
            </p>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#a3b18a", marginTop: "2rem", lineHeight: 1.5 }}>
            Results also sent to {result.email}
          </div>
        </div>

        {/* Zone score summary */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "3rem 1fr", borderBottom: S.border }}>
            <div style={{ borderRight: S.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "#a3b18a" }}>
                SUMMARY
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem", gap: "1.5rem" }}>
              {zones.map((zone, i) => (
                <div key={zone.id} style={{ borderBottom: i < zones.length - 1 ? "1px solid rgba(52,78,65,0.15)" : "none", paddingBottom: i < zones.length - 1 ? "1.25rem" : 0 }}>
                  <div style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em", color: LEVEL_COLORS[zone.level] }}>
                    {zone.score}/10
                  </div>
                  <div style={S.label}>{zone.name}</div>
                  <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: LEVEL_COLORS[zone.level], marginTop: "2px" }}>
                    {LEVEL_LABELS[zone.level]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "2rem" }}>
            <div style={{ fontSize: "0.7rem", color: "#a3b18a", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              {highCount === 0
                ? "No high-friction zones identified."
                : `${highCount} high-friction zone${highCount > 1 ? "s" : ""} — prioritise these.`}
            </div>
          </div>
        </div>
      </section>

      {/* Friction zone cards — AI insights fill in as they arrive */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ ...S.labelLight, marginBottom: "2rem" }}>*THREE FRICTION ZONES</div>
        {zones.map((zone, i) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            index={i}
            aiInsight={aiInsights?.[zone.id] ?? null}
            generating={insightsGenerating}
          />
        ))}
      </section>

      {/* Raw dimension readings — labels driven by DIMENSIONS config */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "0 2rem 3rem" }}>
        <div style={{ border: S.border, padding: "28px" }}>
          <div style={{ ...S.label, marginBottom: "20px" }}>*YOUR RESPONSES — ALL DIMENSIONS</div>
          <div style={{ marginBottom: "8px", display: "flex", gap: "24px" }}>
            {([{ color: "#588157", label: "DEMAND (D)" }, { color: "#344e41", label: "CAPACITY (C)" }] as const).map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", backgroundColor: color }} />
                <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", color, fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
          {/* Labels come from DIMENSIONS — no hardcoded strings to get out of sync */}
          {DIMENSIONS.map((dim) => (
            <SliderSummaryRow
              key={dim.id}
              label={`${dim.number} / ${dim.name}`}
              demand={result[`${dim.id}_demand` as keyof SliderValues] as number}
              capacity={result[`${dim.id}_capacity` as keyof SliderValues] as number}
            />
          ))}
        </div>
      </section>

      {/* Narrative responses */}
      {(result.narrative_peak || result.narrative_friction) && (
        <section style={{ maxWidth: "760px", margin: "0 auto", padding: "0 2rem 3rem" }}>
          <div style={{ border: S.border, padding: "28px", backgroundColor: "rgba(163,177,138,0.06)" }}>
            <div style={{ ...S.labelLight, marginBottom: "24px" }}>*YOUR NARRATIVE</div>
            {(["narrative_peak", "narrative_friction"] as const).map((key, i) => {
              const text = result[key];
              if (!text) return null;
              const otherKey = key === "narrative_peak" ? "narrative_friction" : "narrative_peak";
              return (
                <div
                  key={key}
                  style={{
                    marginBottom: i === 0 && result[otherKey] ? "24px" : 0,
                    paddingBottom: i === 0 && result[otherKey] ? "24px" : 0,
                    borderBottom: i === 0 && result[otherKey] ? "1px solid rgba(52,78,65,0.12)" : "none",
                  }}
                >
                  <div style={{ ...S.label, marginBottom: "12px" }}>
                    {key === "narrative_peak" ? "IN YOUR ELEMENT" : "INTERNAL RESISTANCE"}
                  </div>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "#3a5a40", fontStyle: "italic" }}>
                    &ldquo;{text}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section style={{ padding: "4rem 2rem", borderTop: S.border, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ ...S.labelLight, marginBottom: "8px" }}>*RESULTS DELIVERED</div>
          <p style={{ fontSize: "0.88rem", color: "#588157", lineHeight: 1.5 }}>
            A copy of this profile has been sent to {result.email}
          </p>
        </div>
        <Link href="/assessment" style={{ backgroundColor: "transparent", color: "#344e41", padding: "0.85rem 1.75rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, display: "inline-block", textDecoration: "none", border: "1px solid #344e41" }}>
          Run Instrument Again →
        </Link>
      </section>

      <footer style={{ padding: "2rem", borderTop: S.border }}>
        <div style={S.labelLight}>FOUNDER_FIT — © 2025</div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .results-hero-grid { grid-template-columns: 1fr !important; }
          .results-hero-left { border-right: none !important; border-bottom: ${S.border} !important; }
        }
      `}</style>
    </div>
  );
}
