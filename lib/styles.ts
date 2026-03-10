// ─────────────────────────────────────────────────────────────────────────────
// Shared inline-style constants
// Single source of truth for typography tokens + border used across all pages.
// ─────────────────────────────────────────────────────────────────────────────

export const S = {
  label: {
    fontSize: "0.65rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    fontWeight: 600,
    color: "#344e41",
  },
  labelLight: {
    fontSize: "0.65rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    fontWeight: 600,
    color: "#588157",
  },
  border: "1px solid rgba(52,78,65,0.25)",
} as const;
