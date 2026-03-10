import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const BUSINESS_MODEL_LABELS: Record<string, string> = {
  service_b2b: "Service — Business clients (consulting, freelance, coaching, project work)",
  service_consumer: "Service — Individual clients (tutoring, therapy, personal training, photography)",
  product: "Product (physical or digital goods sold directly to buyers)",
  creative_practice: "Creative practice (making, craft, art, design sold direct, via commissions or markets)",
};

const SYSTEM_PROMPT = `You generate personalised insights for the Founder Fit instrument. You map the gap between what a founder's business demands and what they can sustainably give across four dimensions. You output a JSON object only.

PRINCIPLES - apply without exception:

1. NEURO-AFFIRMING: Friction is always located in the environment-person mismatch, never in the person.

2. TRAIT-BASED NOT LABEL-BASED: Never use diagnostic labels. Use precise trait language: deep pattern recognition, sustained single-channel focus, high contextual sensitivity, non-linear processing, intense creative bursts with genuine recovery needs, strong systems thinking, hyperfocus capacity.

3. STRENGTHS-LED: Every insight leads with what this cognitive profile makes the founder exceptionally capable of. State the asset first. Then frame the friction as: this strength is being deployed in an environment that cannot use it properly.

4. RESEARCH-INFORMED: Reflect these positions without citing them. Friction in communication contexts is bidirectional and environmental. Executive function demands compound under misaligned business models. The friction is in the fit, not the person.

5. MECHANISM-SPECIFIC: When friction mechanisms are provided, use them to explain precisely why the gap exists. Do not name the mechanism directly. Describe the underlying experience and its structural consequence.

6. BUSINESS-MODEL-AWARE: When a business model is provided, frame all redesign directions in terms structurally relevant to that model. Never give generic redesign directions.

7. OUTCOME-ORIENTED: Every insight ends with one specific structural outcome. Always a concrete change to business model, client mix, revenue structure, communication architecture, or working environment. Never a mindset shift. Never a productivity tip.

8. TONE: Direct. Warm. Precise. Short sentences. Active voice. No hedging.

Banned words: journey, empower, unlock, leverage, holistic, ecosystem, synergy, transformative, bandwidth, circle back, deep dive, unpack.

OUTPUT - return only valid JSON, no preamble, no markdown:
{
  "cognitive": { "insight": "2-4 sentences.", "redesignDirection": "2-3 sentences." },
  "operational": { "insight": "2-4 sentences.", "redesignDirection": "2-3 sentences." },
  "relational": { "insight": "2-4 sentences.", "redesignDirection": "2-3 sentences." }
}`;

const AVOIDANCE_LABELS: Record<string, string> = { time_blindness: "time_blindness", initiation_block: "initiation_block", rejection_anticipation: "rejection_anticipation", overwhelm_scaling: "overwhelm_scaling", processing_threshold: "processing_threshold" };
const DEPLETION_LABELS: Record<string, string> = { context_switching_cost: "context_switching_cost", social_energy_depletion: "social_energy_depletion", demand_absorption: "demand_absorption", sensory_overload: "sensory_overload", decision_fatigue_compound: "decision_fatigue_compound" };
const COMMUNICATION_LABELS: Record<string, string> = { async_rhythm_mismatch: "async_rhythm_mismatch", real_time_processing_lag: "real_time_processing_lag", boundary_dysregulation: "boundary_dysregulation", conflict_avoidance_sensing: "conflict_avoidance_sensing", correspondence_volume_overload: "correspondence_volume_overload" };
const OPTIMAL_LABELS: Record<string, string> = { deep_focus_architecture: "deep_focus_architecture", structure_dependency: "structure_dependency", relational_predictability_need: "relational_predictability_need", processing_time_requirement: "processing_time_requirement", interest_driven_capacity: "interest_driven_capacity" };

function resolveMechanism(value: string | undefined, map: Record<string, string>): string | null {
  if (!value) return null;
  return map[value] ?? null;
}

interface TemplateRoute { template: string; variant: string; label: string; reason: string; }

function deriveTemplateRouting(businessModel: string, communication: string | null, depletion: string | null, avoidance: string | null, optimal: string | null): TemplateRoute[] {
  const routes: TemplateRoute[] = [];
  const commsVariant = communication === "async_rhythm_mismatch" ? (businessModel === "service_consumer" ? "01-B" : "01-A") : communication === "correspondence_volume_overload" ? (businessModel === "product" ? "01-D" : businessModel === "creative_practice" ? "01-E" : "01-C") : businessModel === "product" ? "01-D" : businessModel === "creative_practice" ? "01-E" : "01-A";
  routes.push({ template: "01", variant: commsVariant, label: "Communication Rhythm Scripts", reason: communication ? "Matched to your communication pattern and business model" : "Matched to your business model" });
  const scopeSignal = communication === "boundary_dysregulation" ? "boundary_dysregulation" : avoidance === "processing_threshold" ? "processing_threshold" : null;
  const scopeVariant = scopeSignal === "boundary_dysregulation" ? (businessModel === "service_consumer" ? "02-B" : businessModel === "creative_practice" ? "02-C" : "02-A") : scopeSignal === "processing_threshold" ? "02-D" : businessModel === "creative_practice" ? "02-C" : businessModel === "service_consumer" ? "02-B" : businessModel === "product" ? "02-D" : "02-A";
  routes.push({ template: "02", variant: scopeVariant, label: "Scope and Capacity Agreements", reason: scopeSignal ? "Matched to your capacity pattern and business model" : "Matched to your business model" });
  const daySignal = (depletion === "context_switching_cost" || depletion === "social_energy_depletion" || depletion === "demand_absorption") ? "context_switching_cost" : optimal === "deep_focus_architecture" ? "deep_focus_architecture" : null;
  const dayVariant = daySignal === "deep_focus_architecture" ? "03-D" : daySignal === "context_switching_cost" ? (businessModel === "product" ? "03-B" : businessModel === "creative_practice" ? "03-C" : "03-A") : businessModel === "product" ? "03-B" : businessModel === "creative_practice" ? "03-C" : "03-A";
  routes.push({ template: "03", variant: dayVariant, label: "Structured Day Templates", reason: daySignal ? "Matched to your depletion pattern and business model" : "Matched to your business model" });
  const bm: Record<string,string> = { service_b2b: "A", service_consumer: "B", product: "C", creative_practice: "D" };
  const s = bm[businessModel] ?? "A";
  routes.push({ template: "04", variant: `04-${s}`, label: "How I Work — Onboarding Document", reason: "Matched to your business model" });
  routes.push({ template: "05", variant: `05-${s}`, label: "Seven-Day Check-In Email Sequence", reason: "Peer story matched to your business model and friction zone" });
  return routes;
}

function buildUserPrompt(body: Record<string, unknown>): string {
  const d1 = Number(body.pace_demand ?? 5); const c1 = Number(body.pace_capacity ?? 5);
  const d2 = Number(body.ambiguity_demand ?? 5); const c2 = Number(body.ambiguity_capacity ?? 5);
  const d3 = Number(body.relational_demand ?? 5); const c3 = Number(body.relational_capacity ?? 5);
  const d4 = Number(body.novelty_demand ?? 5); const c4 = Number(body.novelty_capacity ?? 5);
  const narrativePeak = String(body.narrative_peak ?? "");
  const narrativeFriction = String(body.narrative_friction ?? "");
  const businessModel = String(body.business_model ?? "");
  const avoidance = resolveMechanism(body.mechanism_avoidance as string | undefined, AVOIDANCE_LABELS);
  const depletion = resolveMechanism(body.mechanism_depletion as string | undefined, DEPLETION_LABELS);
  const communication = resolveMechanism(body.mechanism_communication as string | undefined, COMMUNICATION_LABELS);
  const optimal = resolveMechanism(body.mechanism_optimal as string | undefined, OPTIMAL_LABELS);
  const hasMechanisms = avoidance || depletion || communication || optimal;
  const hasBusinessModel = businessModel && BUSINESS_MODEL_LABELS[businessModel];
  const gap = (d: number, c: number) => Math.abs(d - c);
  const level = (d: number, c: number) => gap(d,c) <= 2 ? "LOW" : gap(d,c) <= 5 ? "MODERATE" : "HIGH";
  const dir = (d: number, c: number) => d > c ? "demand exceeds capacity" : d < c ? "capacity exceeds demand" : "balanced";
  const mechBlock = hasMechanisms ? `\nFRICTION MECHANISMS\n${avoidance?`Task initiation: ${avoidance}\n`:""}${depletion?`Depletion source: ${depletion}\n`:""}${communication?`Communication pattern: ${communication}\n`:""}${optimal?`Optimal conditions: ${optimal}\n`:""}` : "";
  const bmBlock = hasBusinessModel ? `\nBUSINESS MODEL\n${BUSINESS_MODEL_LABELS[businessModel]}\nFrame all redesign directions within this business model.\n` : "";
  return `FOUNDER FIT ASSESSMENT DATA\n\n01 / PACE AND CONTEXT SWITCHING\n  Demand: ${d1}/10  Capacity: ${c1}/10  Gap: ${gap(d1,c1)} - ${level(d1,c1)} (${dir(d1,c1)})\n\n02 / UNCERTAINTY AND COMMUNICATION LOAD\n  Demand: ${d2}/10  Capacity: ${c2}/10  Gap: ${gap(d2,c2)} - ${level(d2,c2)} (${dir(d2,c2)})\n\n03 / RELATIONAL AND COGNITIVE DEPTH\n  Demand: ${d3}/10  Capacity: ${c3}/10  Gap: ${gap(d3,c3)} - ${level(d3,c3)} (${dir(d3,c3)})\n\n04 / NOVELTY AND REVENUE MODEL FIT\n  Demand: ${d4}/10  Capacity: ${c4}/10  Gap: ${gap(d4,c4)} - ${level(d4,c4)} (${dir(d4,c4)})\n\nNARRATIVE\nIn their element: "${narrativePeak}"\nInternal resistance: "${narrativeFriction}"${mechBlock}${bmBlock}\nGenerate the JSON insight object.${hasMechanisms?" Use friction mechanisms to explain each gap.":""}${hasBusinessModel?" Frame redesign directions within their business model.":""}`;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "No API key." }, { status: 503 });
  try {
    const body = await request.json();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({ model: "claude-sonnet-4-6", max_tokens: 2048, system: SYSTEM_PROMPT, messages: [{ role: "user", content: buildUserPrompt(body) }] });
    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const jsonText = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    let insights: Record<string, unknown>;
    try { insights = JSON.parse(jsonText); } catch { return NextResponse.json({ error: "Malformed JSON from model." }, { status: 502 }); }
    const businessModel = String(body.business_model ?? "");
    const communication = resolveMechanism(body.mechanism_communication as string|undefined, COMMUNICATION_LABELS);
    const depletion = resolveMechanism(body.mechanism_depletion as string|undefined, DEPLETION_LABELS);
    const avoidance = resolveMechanism(body.mechanism_avoidance as string|undefined, AVOIDANCE_LABELS);
    const optimal = resolveMechanism(body.mechanism_optimal as string|undefined, OPTIMAL_LABELS);
    const templateRouting = deriveTemplateRouting(businessModel, communication, depletion, avoidance, optimal);
    return NextResponse.json({ ...insights, templateRouting, businessModel: businessModel || null });
  } catch (err) {
    console.error("generate-insights error:", err);
    return NextResponse.json({ error: "Insight generation failed." }, { status: 500 });
  }
}
