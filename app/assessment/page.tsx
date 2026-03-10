"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PairedSlider from "@/components/PairedSlider";
import { DIMENSIONS, NARRATIVE_QUESTIONS } from "@/lib/dimensions";
import { computeFrictionZones, SliderValues } from "@/lib/scoring";
import { S } from "@/lib/styles";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BusinessModel =
  | "service_b2b"
  | "service_consumer"
  | "product"
  | "creative_practice"
  | "";

interface FormState extends SliderValues {
  business_model: BusinessModel;
  narrative_peak: string;
  narrative_friction: string;
  mechanism_avoidance: string;
  mechanism_depletion: string;
  mechanism_communication: string;
  mechanism_optimal: string;
  email: string;
  gdprConsent: boolean;
}

const initialState: FormState = {
  business_model: "",
  pace_demand: 5,
  pace_capacity: 5,
  ambiguity_demand: 5,
  ambiguity_capacity: 5,
  relational_demand: 5,
  relational_capacity: 5,
  novelty_demand: 5,
  novelty_capacity: 5,
  narrative_peak: "",
  narrative_friction: "",
  mechanism_avoidance: "",
  mechanism_depletion: "",
  mechanism_communication: "",
  mechanism_optimal: "",
  email: "",
  gdprConsent: false,
};

// Steps: screener(0) + 4 dimensions(1-4) + narrative(5) + mechanisms(6) + email(7) = 8
const SCREENER_STEP  = 0;
const NARRATIVE_STEP = DIMENSIONS.length + 1;  // 5
const MECHANISM_STEP = DIMENSIONS.length + 2;  // 6
const EMAIL_STEP     = DIMENSIONS.length + 3;  // 7
const TOTAL_STEPS    = DIMENSIONS.length + 4;  // 8

// ─── Business model options ───────────────────────────────────────────────────

const BUSINESS_MODEL_OPTIONS: {
  value: Exclude<BusinessModel, "">;
  label: string;
  description: string;
}[] = [
  {
    value: "service_b2b",
    label: "Service — Business clients",
    description:
      "Consulting, freelance, coaching, or project work with business clients or organisations",
  },
  {
    value: "service_consumer",
    label: "Service — Individual clients",
    description:
      "Tutoring, therapy, personal training, photography, or any service sold directly to individuals",
  },
  {
    value: "product",
    label: "Product",
    description: "Physical or digital goods sold directly to buyers, online or in person",
  },
  {
    value: "creative_practice",
    label: "Creative practice",
    description:
      "Making, craft, art, or design sold direct, via commissions, markets, or platforms",
  },
];

// ─── Mechanism question definitions ──────────────────────────────────────────

const MECHANISM_QUESTIONS = [
  {
    key: "mechanism_avoidance" as keyof FormState,
    question:
      "When you find yourself avoiding starting something you know needs doing, what's most often true?",
    options: [
      { value: "time_blindness",        label: "I genuinely lost track of when it needed to happen" },
      { value: "initiation_block",       label: "I know roughly what to do but can't locate where to begin" },
      { value: "rejection_anticipation", label: "I'm expecting it to go badly and I'm delaying that feeling" },
      { value: "overwhelm_scaling",      label: "The task feels enormous even though I know it isn't" },
      { value: "processing_threshold",   label: "I need more information before I can move and I can't move without it" },
    ],
  },
  {
    key: "mechanism_depletion" as keyof FormState,
    question: "When a working day leaves you most depleted, what happened in it?",
    options: [
      { value: "context_switching_cost",    label: "A lot of switching between different types of tasks" },
      { value: "social_energy_depletion",   label: "More real-time conversation than I had capacity for" },
      { value: "demand_absorption",         label: "I spent most of it managing other people's urgency" },
      { value: "sensory_overload",          label: "The environment was noisier or more stimulating than I could filter" },
      { value: "decision_fatigue_compound", label: "I made a lot of small decisions that added up to something exhausting" },
    ],
  },
  {
    key: "mechanism_communication" as keyof FormState,
    question:
      "When communication with clients or collaborators goes wrong, what's usually underneath it?",
    options: [
      { value: "async_rhythm_mismatch",         label: "I took longer to respond than expected and it created tension" },
      { value: "real_time_processing_lag",       label: "I couldn't find the right words in the moment and it came across wrong" },
      { value: "boundary_dysregulation",         label: "I said yes to something I couldn't deliver the way I agreed to" },
      { value: "conflict_avoidance_sensing",     label: "I picked up that something was off but didn't know how to raise it" },
      { value: "correspondence_volume_overload", label: "The volume of back-and-forth overwhelmed my capacity to track it" },
    ],
  },
  {
    key: "mechanism_optimal" as keyof FormState,
    question: "When you're working at your best, what's true about the conditions?",
    options: [
      { value: "deep_focus_architecture",       label: "I have a long uninterrupted stretch with one thing in front of me" },
      { value: "structure_dependency",          label: "I know exactly what is expected and when" },
      { value: "relational_predictability_need",label: "The people around me are predictable and low-maintenance" },
      { value: "processing_time_requirement",   label: "I have enough time to think properly before I have to respond or decide" },
      { value: "interest_driven_capacity",      label: "I'm working on something I care about deeply enough to sustain attention" },
    ],
  },
];

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={S.labelLight}>*PROGRESS</span>
        <span style={S.label}>{step}/{TOTAL_STEPS}</span>
      </div>
      <div style={{ height: "3px", backgroundColor: "rgba(52,78,65,0.15)", width: "100%" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: "#588157",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── Nav button ───────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "ghost";

function NavButton({
  onClick,
  variant = "primary",
  children,
  disabled,
}: {
  onClick?: () => void;
  variant?: ButtonVariant;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: "0.78rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: 600,
        padding: "0.85rem 1.75rem",
        border: "1px solid #344e41",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background-color 0.15s ease, color 0.15s ease",
        fontFamily: "inherit",
        backgroundColor: variant === "primary" ? "#344e41" : "transparent",
        color: variant === "primary" ? "#dad7cd" : "#344e41",
      }}
    >
      {children}
    </button>
  );
}

// ─── Radio option ─────────────────────────────────────────────────────────────

function RadioOption({
  value,
  label,
  selected,
  onChange,
}: {
  value: string;
  label: string;
  selected: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        width: "100%",
        textAlign: "left",
        padding: "16px 18px",
        border: `1px solid ${selected ? "#344e41" : "rgba(52,78,65,0.2)"}`,
        backgroundColor: selected ? "rgba(52,78,65,0.06)" : "transparent",
        cursor: "pointer",
        marginBottom: "8px",
        fontFamily: "inherit",
        transition: "all 0.15s ease",
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          minWidth: "18px",
          borderRadius: "50%",
          border: `2px solid ${selected ? "#344e41" : "rgba(52,78,65,0.35)"}`,
          backgroundColor: selected ? "#344e41" : "transparent",
          marginTop: "1px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
        }}
      >
        {selected && (
          <div
            style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#dad7cd" }}
          />
        )}
      </div>
      <span
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.5,
          color: selected ? "#344e41" : "#588157",
          fontWeight: selected ? 500 : 400,
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ─── Business model card ──────────────────────────────────────────────────────

function BusinessModelCard({
  value,
  label,
  description,
  selected,
  onChange,
}: {
  value: Exclude<BusinessModel, "">;
  label: string;
  description: string;
  selected: boolean;
  onChange: (v: Exclude<BusinessModel, "">) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        width: "100%",
        textAlign: "left",
        padding: "20px 22px",
        border: `1px solid ${selected ? "#344e41" : "rgba(52,78,65,0.2)"}`,
        backgroundColor: selected ? "rgba(52,78,65,0.06)" : "transparent",
        cursor: "pointer",
        marginBottom: "10px",
        fontFamily: "inherit",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
        <div
          style={{
            width: "18px",
            height: "18px",
            minWidth: "18px",
            borderRadius: "50%",
            border: `2px solid ${selected ? "#344e41" : "rgba(52,78,65,0.35)"}`,
            backgroundColor: selected ? "#344e41" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
        >
          {selected && (
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#dad7cd" }} />
          )}
        </div>
        <span style={{ fontSize: "1rem", fontWeight: selected ? 600 : 500, color: "#344e41", lineHeight: 1.3 }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: "0.85rem", color: "#588157", lineHeight: 1.55, paddingLeft: "30px" }}>
        {description}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.email || !form.gdprConsent) return;
    setSubmitting(true);
    setError(null);

    const sliderValues: SliderValues = {
      pace_demand:         form.pace_demand,
      pace_capacity:       form.pace_capacity,
      ambiguity_demand:    form.ambiguity_demand,
      ambiguity_capacity:  form.ambiguity_capacity,
      relational_demand:   form.relational_demand,
      relational_capacity: form.relational_capacity,
      novelty_demand:      form.novelty_demand,
      novelty_capacity:    form.novelty_capacity,
    };

    const localId = crypto.randomUUID();
    const cachedPayload = {
      id: localId,
      email: form.email,
      created_at: new Date().toISOString(),
      business_model: form.business_model,
      ...sliderValues,
      narrative_peak:          form.narrative_peak          || null,
      narrative_friction:      form.narrative_friction      || null,
      mechanism_avoidance:     form.mechanism_avoidance     || null,
      mechanism_depletion:     form.mechanism_depletion     || null,
      mechanism_communication: form.mechanism_communication || null,
      mechanism_optimal:       form.mechanism_optimal       || null,
    };

    try {
      localStorage.setItem(`ff-result-${localId}`, JSON.stringify(cachedPayload));
    } catch {
      // localStorage unavailable
    }

    let navigateToId = localId;
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const { id: dbId } = await res.json();
        if (dbId && dbId !== localId) {
          try {
            localStorage.setItem(
              `ff-result-${dbId}`,
              JSON.stringify({ ...cachedPayload, id: dbId })
            );
          } catch { /* ignore */ }
          navigateToId = dbId;
        }
      }
    } catch {
      // Network error — use localId
    }

    router.push(`/results/${navigateToId}`);
  }

  const canProceed = () => {
    if (step === SCREENER_STEP)  return form.business_model !== "";
    if (step === EMAIL_STEP)     return form.email.trim().length > 0 && form.gdprConsent;
    if (step === MECHANISM_STEP) {
      return (
        form.mechanism_avoidance     !== "" &&
        form.mechanism_depletion     !== "" &&
        form.mechanism_communication !== "" &&
        form.mechanism_optimal       !== ""
      );
    }
    return true; // slider steps always have defaults
  };

  // ─── Step renderers ─────────────────────────────────────────────────────────

  function renderScreenerStep() {
    return (
      <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(52,78,65,0.15)", lineHeight: 1 }}>
              01
            </span>
            <span style={S.labelLight}>YOUR BUSINESS</span>
          </div>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#344e41", marginBottom: "10px", maxWidth: "520px" }}>
            Which of these best describes how your business generates revenue?
          </p>
          <p style={{ fontSize: "0.85rem", color: "#588157", lineHeight: 1.5 }}>
            This shapes which structural recommendations are relevant to you.
          </p>
        </div>

        <div style={{ borderTop: S.border, paddingTop: "28px" }}>
          {BUSINESS_MODEL_OPTIONS.map((opt) => (
            <BusinessModelCard
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              selected={form.business_model === opt.value}
              onChange={(v) => setField("business_model", v)}
            />
          ))}
        </div>
      </div>
    );
  }

  function renderSliderStep(dimIndex: number) {
    const dim = DIMENSIONS[dimIndex];
    if (!dim) return null;
    const demandKey   = `${dim.key}_demand`   as keyof SliderValues;
    const capacityKey = `${dim.key}_capacity` as keyof SliderValues;
    return (
      <PairedSlider
        stepNumber={dimIndex + 2}
        totalSteps={TOTAL_STEPS}
        title={dim.title}
        subtitle={dim.subtitle}
        demand={{
          label:      dim.demand.label,
          anchorLow:  dim.demand.anchorLow,
          anchorHigh: dim.demand.anchorHigh,
          value:      form[demandKey] as number,
          onChange:   (v) => setForm((prev) => ({ ...prev, [demandKey]: v })),
        }}
        capacity={{
          label:      dim.capacity.label,
          anchorLow:  dim.capacity.anchorLow,
          anchorHigh: dim.capacity.anchorHigh,
          value:      form[capacityKey] as number,
          onChange:   (v) => setForm((prev) => ({ ...prev, [capacityKey]: v })),
        }}
      />
    );
  }

  function renderNarrativeStep() {
    return (
      <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(52,78,65,0.15)", lineHeight: 1 }}>
              06
            </span>
            <span style={S.labelLight}>NARRATIVE</span>
          </div>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#344e41", marginBottom: "10px", maxWidth: "520px" }}>
            Two open questions. Write freely.
          </p>
          <p style={{ fontSize: "0.85rem", color: "#588157", lineHeight: 1.5 }}>
            These responses stay private and inform the depth of your profile. There are no right or wrong answers.
          </p>
        </div>

        {(["peak", "friction"] as const).map((key, i) => {
          const q = NARRATIVE_QUESTIONS[key];
          const formKey = key === "peak" ? "narrative_peak" : "narrative_friction";
          return (
            <div key={key} style={{ borderTop: S.border, paddingTop: "28px", marginBottom: i === 0 ? "32px" : 0 }}>
              <div style={{ ...S.labelLight, marginBottom: "12px" }}>{q.label}</div>
              <p style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em", color: "#344e41", marginBottom: "16px", lineHeight: 1.3 }}>
                {q.question}
              </p>
              <textarea
                value={form[formKey]}
                onChange={(e) => setField(formKey, e.target.value)}
                placeholder={q.placeholder}
                rows={5}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(163,177,138,0.08)",
                  border: S.border,
                  padding: "16px",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: "#344e41",
                  outline: "none",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  function renderMechanismStep() {
    return (
      <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(52,78,65,0.15)", lineHeight: 1 }}>
              07
            </span>
            <span style={S.labelLight}>HOW IT FEELS</span>
          </div>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#344e41", marginBottom: "10px", maxWidth: "520px" }}>
            A few more questions to sharpen your results.
          </p>
          <p style={{ fontSize: "0.85rem", color: "#588157", lineHeight: 1.5 }}>
            There are no right answers here. These help explain the pattern behind your scores.
          </p>
        </div>

        {MECHANISM_QUESTIONS.map((mq, i) => (
          <div
            key={mq.key}
            style={{ borderTop: S.border, paddingTop: "28px", marginBottom: i < MECHANISM_QUESTIONS.length - 1 ? "32px" : 0 }}
          >
            <div style={{ ...S.labelLight, marginBottom: "12px" }}>
              QUESTION {i + 1} OF {MECHANISM_QUESTIONS.length}
            </div>
            <p style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em", color: "#344e41", marginBottom: "18px", lineHeight: 1.35, maxWidth: "520px" }}>
              {mq.question}
            </p>
            <div>
              {mq.options.map((opt) => (
                <RadioOption
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  selected={form[mq.key] === opt.value}
                  onChange={(v) => setField(mq.key, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderEmailStep() {
    return (
      <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(52,78,65,0.15)", lineHeight: 1 }}>
              08
            </span>
            <span style={S.labelLight}>YOUR PROFILE</span>
          </div>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#344e41", marginBottom: "10px", maxWidth: "480px" }}>
            Where should we send your Founder Fit profile?
          </p>
          <p style={{ fontSize: "0.85rem", color: "#588157", lineHeight: 1.5 }}>
            Your complete profile — three friction zones, scores, and redesign directions — will be sent to you immediately.
          </p>
        </div>

        <div style={{ borderTop: S.border, paddingTop: "32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="email" style={{ ...S.label, display: "block", marginBottom: "10px" }}>
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                width: "100%",
                maxWidth: "420px",
                backgroundColor: "rgba(163,177,138,0.08)",
                border: S.border,
                padding: "14px 16px",
                fontSize: "1rem",
                color: "#344e41",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "14px", cursor: "pointer", maxWidth: "520px" }}>
              <div
                onClick={() => setField("gdprConsent", !form.gdprConsent)}
                style={{
                  width: "20px",
                  height: "20px",
                  minWidth: "20px",
                  border: `2px solid ${form.gdprConsent ? "#344e41" : "rgba(52,78,65,0.4)"}`,
                  backgroundColor: form.gdprConsent ? "#344e41" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginTop: "2px",
                  transition: "all 0.15s ease",
                }}
              >
                {form.gdprConsent && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4L4.5 7.5L11 1" stroke="#dad7cd" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={form.gdprConsent}
                onChange={(e) => setField("gdprConsent", e.target.checked)}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                aria-label="Consent to receive email results"
              />
              <span style={{ fontSize: "0.85rem", lineHeight: 1.55, color: "#588157" }}>
                I consent to receiving my Founder Fit results by email. My slider responses and
                narrative answers will be stored to generate my profile. I can withdraw this
                consent at any time by contacting the team.
              </span>
            </label>
          </div>

          {error && (
            <div style={{ backgroundColor: "rgba(88,129,87,0.1)", border: "1px solid #588157", padding: "12px 16px", marginBottom: "20px", fontSize: "0.875rem", color: "#344e41", maxWidth: "420px" }}>
              {error}
            </div>
          )}

          <NavButton onClick={handleSubmit} disabled={submitting || !form.email || !form.gdprConsent}>
            {submitting ? "Generating Profile..." : "View My Profile ->"}
          </NavButton>

          <p style={{ fontSize: "0.78rem", color: "#a3b18a", marginTop: "16px", lineHeight: 1.5 }}>
            No spam. One email with your results, then nothing unless you ask.
          </p>
        </div>
      </div>
    );
  }

  // ─── Step label for header ──────────────────────────────────────────────────

  const stepLabel =
    step === SCREENER_STEP  ? "YOUR BUSINESS" :
    step < NARRATIVE_STEP   ? `DIMENSION ${step} OF ${DIMENSIONS.length}` :
    step === NARRATIVE_STEP ? "NARRATIVE QUESTIONS" :
    step === MECHANISM_STEP ? "HOW IT FEELS" :
                              "EMAIL & RESULTS";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: "#dad7cd", minHeight: "100vh" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: S.border,
          position: "sticky",
          top: 0,
          backgroundColor: "#dad7cd",
          zIndex: 10,
        }}
      >
        <Link href="/" style={{ ...S.label, textDecoration: "none" }}>
          FOUNDER_FIT
        </Link>
        <span style={{ ...S.label, color: "#a3b18a" }}>{stepLabel}</span>
      </header>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        <div style={{ paddingTop: "2rem" }}>
          <ProgressBar step={step} />
        </div>

        {step === SCREENER_STEP                        && renderScreenerStep()}
        {step >= 1 && step < NARRATIVE_STEP            && renderSliderStep(step - 1)}
        {step === NARRATIVE_STEP                       && renderNarrativeStep()}
        {step === MECHANISM_STEP                       && renderMechanismStep()}
        {step === EMAIL_STEP                           && renderEmailStep()}

        {step < TOTAL_STEPS - 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "32px",
              borderTop: S.border,
              marginTop: "8px",
            }}
          >
            <NavButton onClick={() => setStep((s) => s - 1)} variant="ghost" disabled={step === 0}>
              &lt;- Back
            </NavButton>
            <NavButton onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Continue -&gt;
            </NavButton>
          </div>
        )}
      </main>
    </div>
  );
}
