import type { FrictionZone } from "./scoring";

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATE
// ← Replace copy blocks with your final email template content
// ─────────────────────────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<string, string> = {
  high: "HIGH FRICTION",
  medium: "MODERATE FRICTION",
  low: "LOW FRICTION",
};

const LEVEL_COLORS: Record<string, string> = {
  high: "#588157",
  medium: "#3a5a40",
  low: "#a3b18a",
};

interface EmailData {
  email: string;
  zones: FrictionZone[];
  narrative_peak?: string;
  narrative_friction?: string;
}

export function generateEmailHTML(data: EmailData): string {
  const { zones, narrative_peak, narrative_friction } = data;

  const zonesHTML = zones
    .map(
      (zone) => `
    <div style="border: 1px solid #344e41; margin-bottom: 24px; padding: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; color: #344e41;">
          ${zone.name}
        </div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: ${LEVEL_COLORS[zone.level]}; border: 1px solid ${LEVEL_COLORS[zone.level]}; padding: 4px 10px;">
          ${LEVEL_LABELS[zone.level]}
        </div>
      </div>

      <!-- Gap bar -->
      <div style="background: #dad7cd; height: 4px; margin-bottom: 20px; width: 100%;">
        <div style="background: ${LEVEL_COLORS[zone.level]}; height: 4px; width: ${(zone.score / 10) * 100}%;"></div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #3a5a40; margin-bottom: 16px;">
        ${zone.insight}
      </p>

      <div style="border-top: 1px solid rgba(52,78,65,0.2); padding-top: 16px; margin-top: 16px;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; color: #588157; margin-bottom: 8px;">
          REDESIGN DIRECTION
        </div>
        <p style="font-size: 13px; line-height: 1.6; color: #344e41;">
          ${zone.redesignDirection}
        </p>
      </div>
    </div>
  `
    )
    .join("");

  const narrativeHTML =
    narrative_peak || narrative_friction
      ? `
    <div style="border: 1px solid rgba(52,78,65,0.3); padding: 28px; margin-bottom: 32px; background: rgba(163,177,138,0.1);">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; color: #344e41; margin-bottom: 20px;">
        *YOUR NARRATIVE
      </div>
      ${
        narrative_peak
          ? `
        <div style="margin-bottom: 20px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #588157; margin-bottom: 8px;">IN YOUR ELEMENT</div>
          <p style="font-size: 14px; line-height: 1.6; color: #3a5a40; font-style: italic;">"${narrative_peak}"</p>
        </div>
      `
          : ""
      }
      ${
        narrative_friction
          ? `
        <div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #588157; margin-bottom: 8px;">INTERNAL RESISTANCE</div>
          <p style="font-size: 14px; line-height: 1.6; color: #3a5a40; font-style: italic;">"${narrative_friction}"</p>
        </div>
      `
          : ""
      }
    </div>
  `
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Founder Fit Profile</title>
</head>
<body style="margin: 0; padding: 0; background-color: #dad7cd; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #dad7cd;">

    <!-- Header -->
    <div style="padding: 32px; border-bottom: 1px solid #344e41;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; color: #344e41;">
        FOUNDER_FIT
      </div>
    </div>

    <!-- Title block -->
    <div style="padding: 40px 32px; border-bottom: 1px solid #344e41;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; color: #588157; margin-bottom: 16px;">
        *YOUR PROFILE
      </div>
      <h1 style="font-size: 36px; font-weight: 800; line-height: 0.9; letter-spacing: -0.04em; text-transform: uppercase; color: #344e41; margin: 0 0 20px 0;">
        FOUNDER<br>FIT<br>PROFILE
      </h1>
      <!-- ← Replace with your final intro copy -->
      <p style="font-size: 14px; line-height: 1.6; color: #3a5a40; max-width: 440px;">
        Below are the three friction zones identified by the instrument. Each shows where the gap between what your environment demands and what you can give is creating the most structural drag.
      </p>
    </div>

    <!-- Friction zones -->
    <div style="padding: 40px 32px;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; color: #344e41; margin-bottom: 24px;">
        *THREE FRICTION ZONES
      </div>
      ${zonesHTML}
    </div>

    <!-- Narrative -->
    ${narrativeHTML ? `<div style="padding: 0 32px 40px;">${narrativeHTML}</div>` : ""}

    <!-- Footer -->
    <div style="padding: 32px; border-top: 1px solid #344e41;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; color: #344e41; margin-bottom: 8px;">
        FOUNDER_FIT
      </div>
      <p style="font-size: 12px; color: #588157; margin: 0;">
        You received this because you completed the Founder Fit instrument and consented to receive your results by email.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}
