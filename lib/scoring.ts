// ─────────────────────────────────────────────────────────────────────────────
// SCORING LOGIC
// Update classification thresholds and insight copy when you receive
// the final scoring logic and email template content.
// ─────────────────────────────────────────────────────────────────────────────

export type FrictionLevel = "low" | "medium" | "high";

export interface FrictionZone {
  id: "cognitive" | "operational" | "relational";
  name: string;
  score: number; // 0–10 absolute gap
  level: FrictionLevel;
  insight: string;
  redesignDirection: string;
}

export interface SliderValues {
  pace_demand: number;
  pace_capacity: number;
  ambiguity_demand: number;
  ambiguity_capacity: number;
  relational_demand: number;
  relational_capacity: number;
  novelty_demand: number;
  novelty_capacity: number;
}

// ─── AI-generated insight types ──────────────────────────────────────────────
// Defined here (not in the API route) so client components can import safely.

export interface ZoneInsight {
  insight: string;
  redesignDirection: string;
}

export interface GeneratedInsights {
  cognitive: ZoneInsight;
  operational: ZoneInsight;
  relational: ZoneInsight;
}

// ─── Shared colour + label maps ───────────────────────────────────────────────
// Imported by GapBar, results page, and email template — single source of truth.

export const LEVEL_COLORS: Record<FrictionLevel, string> = {
  high: "#344e41",
  medium: "#588157",
  low: "#a3b18a",
};

export const LEVEL_LABELS: Record<FrictionLevel, string> = {
  high: "HIGH FRICTION",
  medium: "MODERATE FRICTION",
  low: "LOW FRICTION",
};

// ← UPDATE: Replace thresholds with your final classification logic
function classify(score: number): FrictionLevel {
  if (score <= 3) return "low";
  if (score <= 6) return "medium";
  return "high";
}

/** Returns the severity colour for a raw gap score (0–10). */
export function getGapColor(score: number): string {
  return LEVEL_COLORS[classify(score)];
}

/** Returns "LOW" | "MEDIUM" | "HIGH" for a raw gap score. */
export function getGapLevelLabel(score: number): string {
  return classify(score).toUpperCase();
}

function gap(demand: number, capacity: number): number {
  return Math.abs(demand - capacity);
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHT COPY
// ← Replace all strings below with your final email template content
// ─────────────────────────────────────────────────────────────────────────────

const INSIGHTS: Record<string, Record<FrictionLevel, string>> = {
  cognitive: {
    low: "Your tolerance for uncertainty is well-matched to the ambiguity your business carries. This dimension isn't where your energy is leaking — the friction lives elsewhere.",
    medium:
      "There's meaningful friction in how you're processing uncertainty. You can function here, but it's costing more energy than it should. Focus on reducing decision frequency, not decision quality — fewer choices per day creates the cognitive space you need.",
    high: "Your business is operating in a level of uncertainty that exceeds your current cognitive carrying capacity. The friction here is structural — you're being asked to navigate blind more than your nervous system is wired for.",
  },
  operational: {
    low: "Your operational style is broadly matched to what the business needs. Friction here is situational, not structural.",
    medium:
      "Moderate friction in your operational rhythm. You're keeping up, but the cost is probably showing in your recovery time and decision quality by Friday afternoon.",
    high: "The gap between the pace your business demands and the pace you can sustain is significant. You may be managing this with willpower — which is a depleting resource, not a strategy.",
  },
  relational: {
    low: "Your social bandwidth is well-matched to the relational demands of the business. This isn't your primary friction source.",
    medium:
      "Relational demands are creating noticeable friction. You're giving more social energy than you're recovering. A structured approach to relationship prioritisation would create immediate relief.",
    high: "The relational demands of your business substantially exceed your social bandwidth. This is one of the least-discussed but most depleting founder friction zones.",
  },
};

const REDESIGN: Record<string, Record<FrictionLevel, string>> = {
  cognitive: {
    low: "Maintain your current operating rhythm. Use the cognitive capacity you're not spending here to address higher-friction zones.",
    medium:
      "Install more frequent decision checkpoints, shrink planning horizons, and create more proximate feedback loops. Clarity at short range reduces the load of carrying long-range uncertainty.",
    high: "Priority redesign: reduce the number of open decisions you're carrying at any one time. Create a 'parking system' for unresolved questions so they're not occupying live RAM. Shorter decision cycles — weekly rather than quarterly — will reduce the ambient load significantly.",
  },
  operational: {
    low: "Continue as is. Invest any freed operational capacity into the zones where friction is higher.",
    medium:
      "Build one structural change this month that reduces your personal operational surface. The goal isn't to work less — it's to work at the right altitude.",
    high: "Identify which operational demands can be systematised, delegated, or eliminated before next quarter. For each recurring task you own personally, ask: does this specifically require me, or have I just never let go of it?",
  },
  relational: {
    low: "No structural action needed here. Stay attentive to changes if your stakeholder base grows rapidly.",
    medium:
      "Introduce a simple relationship audit: list every recurring relational demand and score it by energy cost vs. strategic value. Cut or reduce the low-value high-cost ones first.",
    high: "Audit every recurring relationship demand and ask which ones genuinely require you personally. Most don't. Build a delegation or routing layer between yourself and the volume of relational demand your business is generating.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

/** Build a single zone, calling classify() exactly once per zone. */
function makeZone(
  id: FrictionZone["id"],
  name: string,
  score: number,
  insights: Record<FrictionLevel, string>,
  redesign: Record<FrictionLevel, string>
): FrictionZone {
  const level = classify(score);
  return { id, name, score, level, insight: insights[level], redesignDirection: redesign[level] };
}

export function computeFrictionZones(data: SliderValues): FrictionZone[] {
  const cognitiveScore = gap(data.ambiguity_demand, data.ambiguity_capacity);
  const operationalScore = Math.round(
    (gap(data.pace_demand, data.pace_capacity) +
      gap(data.novelty_demand, data.novelty_capacity)) /
      2
  );
  const relationalScore = gap(data.relational_demand, data.relational_capacity);

  return [
    makeZone("cognitive",   "COGNITIVE LOAD",   cognitiveScore,   INSIGHTS.cognitive,   REDESIGN.cognitive),
    makeZone("operational", "OPERATIONAL FIT",  operationalScore, INSIGHTS.operational, REDESIGN.operational),
    makeZone("relational",  "RELATIONAL DRAIN", relationalScore,  INSIGHTS.relational,  REDESIGN.relational),
  ];
}
