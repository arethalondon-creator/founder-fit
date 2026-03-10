import { NextRequest, NextResponse } from "next/server";
import { computeFrictionZones, SliderValues } from "@/lib/scoring";
import { generateEmailHTML } from "@/lib/email-template";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate and cast slider values once ──────────────────────────────
    // Casting happens here so downstream code uses numbers, not strings.
    const requiredSliderKeys: (keyof SliderValues)[] = [
      "pace_demand",     "pace_capacity",
      "ambiguity_demand","ambiguity_capacity",
      "relational_demand","relational_capacity",
      "novelty_demand",  "novelty_capacity",
    ];

    const sliderValues: Partial<SliderValues> = {};
    for (const field of requiredSliderKeys) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
      sliderValues[field] = Number(body[field]);
    }

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!body.gdprConsent) {
      return NextResponse.json({ error: "GDPR consent is required." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();

    // ── Compute friction zones ────────────────────────────────────────────
    const zones = computeFrictionZones(sliderValues as SliderValues);
    const [cognitive, operational, relational] = zones;

    // ── Try to save to Supabase (optional — skipped if not configured) ────
    let assessmentId: string | null = null;
    let emailSent = false;

    const supabaseConfigured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseConfigured) {
      try {
        const { createServerClient } = await import("@/lib/supabase");
        const supabase = createServerClient();

        const { data, error: dbError } = await supabase
          .from("assessment_responses")
          .insert({
            email,
            gdpr_consent: true,
            ...sliderValues,
            narrative_peak: body.narrative_peak || null,
            narrative_friction: body.narrative_friction || null,
            zone_cognitive_score: cognitive.score,
            zone_operational_score: operational.score,
            zone_relational_score: relational.score,
            zone_cognitive_level: cognitive.level,
            zone_operational_level: operational.level,
            zone_relational_level: relational.level,
            // email_sent written in the same round-trip once we know the result
          })
          .select("id")
          .single();

        if (!dbError && data) {
          assessmentId = data.id;
        } else {
          console.error("Supabase insert error:", dbError);
        }
      } catch (dbErr) {
        console.error("Supabase unavailable:", dbErr);
      }
    } else {
      console.info("Supabase not configured — skipping DB write.");
    }

    // ── Try to send email via Resend (optional — skipped if not configured) ─
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { error: emailError } = await resend.emails.send({
          from: `${process.env.RESEND_FROM_NAME ?? "Founder Fit"} <${process.env.RESEND_FROM_EMAIL ?? "results@founderfit.co"}>`,
          to: email,
          subject: "Your Founder Fit Profile",
          html: generateEmailHTML({
            email,
            zones,
            narrative_peak: body.narrative_peak,
            narrative_friction: body.narrative_friction,
          }),
        });

        emailSent = !emailError;
        if (emailError) console.error("Resend error:", emailError);
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    } else {
      console.info("RESEND_API_KEY not set — skipping email.");
    }

    // ── Update email_sent flag in a single additional query (only if needed) ─
    if (assessmentId && emailSent) {
      try {
        const { createServerClient } = await import("@/lib/supabase");
        await createServerClient()
          .from("assessment_responses")
          .update({ email_sent: true, email_sent_at: new Date().toISOString() })
          .eq("id", assessmentId);
      } catch { /* non-critical */ }
    }

    // id is null when Supabase is not configured — client uses its localId.
    return NextResponse.json({ id: assessmentId, emailSent });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
