"use client";

import { getGapColor, getGapLevelLabel } from "@/lib/scoring";

interface GapBarProps {
  demand: number;
  capacity: number;
  min?: number;
  max?: number;
}

export default function GapBar({
  demand,
  capacity,
  min = 0,
  max = 10,
}: GapBarProps) {
  const range = max - min;
  const demandPct = ((demand - min) / range) * 100;
  const capacityPct = ((capacity - min) / range) * 100;

  const gapScore = Math.abs(demand - capacity);
  const left = Math.min(demandPct, capacityPct);
  const width = Math.abs(demandPct - capacityPct);

  // Derived from scoring helpers — single source of truth for colours/labels
  const gapColor = getGapColor(gapScore);
  const levelLabel = getGapLevelLabel(gapScore);

  return (
    <div style={{ width: "100%" }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            textTransform: "uppercase" as const,
            letterSpacing: "0.12em",
            fontWeight: 600,
            color: "#588157",
          }}
        >
          GAP INDICATOR
        </span>
        <span
          style={{
            fontSize: "10px",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            fontWeight: 700,
            color: gapColor,
          }}
        >
          {gapScore}/10 — {levelLabel}
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          position: "relative",
          height: "6px",
          backgroundColor: "rgba(52,78,65,0.15)",
          width: "100%",
        }}
      >
        {/* Filled gap section */}
        {width > 0 && (
          <div
            style={{
              position: "absolute",
              left: `${left}%`,
              width: `${width}%`,
              height: "100%",
              backgroundColor: gapColor,
              transition: "left 0.1s ease, width 0.1s ease, background-color 0.2s ease",
            }}
          />
        )}

        {/* Demand marker */}
        <div
          style={{
            position: "absolute",
            left: `${demandPct}%`,
            top: "-5px",
            transform: "translateX(-50%)",
            width: "4px",
            height: "16px",
            backgroundColor: "#588157",
            transition: "left 0.1s ease",
          }}
        />

        {/* Capacity marker */}
        <div
          style={{
            position: "absolute",
            left: `${capacityPct}%`,
            top: "-5px",
            transform: "translateX(-50%)",
            width: "4px",
            height: "16px",
            backgroundColor: "#344e41",
            transition: "left 0.1s ease",
          }}
        />
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          {(
            [
              { color: "#588157", label: "DEMAND" },
              { color: "#344e41", label: "CAPACITY" },
            ] as const
          ).map(({ color, label }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div style={{ width: "8px", height: "8px", backgroundColor: color }} />
              <span
                style={{
                  fontSize: "9px",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color,
                  fontWeight: 600,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        {demand !== capacity && (
          <span
            style={{
              fontSize: "9px",
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              color: "#588157",
              fontWeight: 600,
            }}
          >
            {demand > capacity
              ? "↑ DEMAND EXCEEDS CAPACITY"
              : "↑ CAPACITY EXCEEDS DEMAND"}
          </span>
        )}
      </div>
    </div>
  );
}
