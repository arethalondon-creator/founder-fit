// ─────────────────────────────────────────────────────────────────────────────
// DIMENSIONS CONFIG
// Update question text, anchor labels, and scale descriptions here
// when you receive the final copy.
// ─────────────────────────────────────────────────────────────────────────────

export interface DimensionConfig {
  id: "pace" | "ambiguity" | "relational" | "novelty";
  number: string;
  name: string;
  question: string;
  description: string;
  demand: {
    label: string;
    anchorLow: string;
    anchorHigh: string;
  };
  capacity: {
    label: string;
    anchorLow: string;
    anchorHigh: string;
  };
}

export const DIMENSIONS: DimensionConfig[] = [
  {
    id: "pace",
    number: "01",
    name: "CONTEXT SWITCHING",
    // ← Replace with your final question text
    question:
      "How fast does your business environment demand output — and how fast can you sustainably operate?",
    description:
      "Maps the execution speed of the business against the founder's natural rhythm.",
    demand: {
      label: "BUSINESS DEMANDS",
      anchorLow: "Steady & methodical", // ← Replace
      anchorHigh: "Relentless sprint", // ← Replace
    },
    capacity: {
      label: "YOUR CAPACITY",
      anchorLow: "Need slow burn", // ← Replace
      anchorHigh: "Thrive in intensity", // ← Replace
    },
  },
  {
    id: "ambiguity",
    number: "02",
    name: "COMMUNICATION DEMAND",
    question:
      "How much ambiguity does your environment carry — and how much can you hold without losing function?",
    description:
      "Maps the uncertainty of the market against the founder's tolerance for operating without clear coordinates.",
    demand: {
      label: "BUSINESS DEMANDS",
      anchorLow: "Well-defined territory", // ← Replace
      anchorHigh: "Frontier conditions", // ← Replace
    },
    capacity: {
      label: "YOUR CAPACITY",
      anchorLow: "Need clear maps", // ← Replace
      anchorHigh: "Navigate without coordinates", // ← Replace
    },
  },
  {
    id: "relational",
    number: "03",
    name: "COGNITIVE DEPTH FIT",
    question:
      "How many relationship demands does your business place on you — and how much social energy do you have to give?",
    description:
      "Maps the relational complexity of the business against the founder's actual social bandwidth.",
    demand: {
      label: "BUSINESS DEMANDS",
      anchorLow: "Lean operation", // ← Replace
      anchorHigh: "Dense stakeholder web", // ← Replace
    },
    capacity: {
      label: "YOUR CAPACITY",
      anchorLow: "Introvert mode", // ← Replace
      anchorHigh: "Energised by people", // ← Replace
    },
  },
  {
    id: "novelty",
    number: "04",
    name: "REVENUE MODEL FIT",
    question:
      "Does your business demand constant invention or reliable execution — and where does your cognitive energy flow?",
    description:
      "Maps creative vs. operational demands of the business against the founder's natural orientation.",
    demand: {
      label: "BUSINESS DEMANDS",
      anchorLow: "Execute known systems", // ← Replace
      anchorHigh: "Constant invention", // ← Replace
    },
    capacity: {
      label: "YOUR CAPACITY",
      anchorLow: "Need clear processes", // ← Replace
      anchorHigh: "Wired for novelty", // ← Replace
    },
  },
];

export const NARRATIVE_QUESTIONS = {
  peak: {
    label: "01 / IN YOUR ELEMENT",
    // ← Replace with your final question text
    question:
      "Describe a moment in the last 90 days when you felt genuinely in your element.",
    placeholder:
      "Write freely. What were you doing, who were you with, and what made it feel right?",
  },
  friction: {
    label: "02 / INTERNAL RESISTANCE",
    question:
      "Where in the business do you notice the most resistance — in yourself, not in the market?",
    placeholder:
      "Not what's hard out there. What's hard in here — the tasks, interactions, or decisions that cost more than they should?",
  },
};
