"use client";

import GapBar from "./GapBar";

interface PairedSliderProps {
  dimensionNumber: string;
  dimensionName: string;
  question: string;
  description: string;
  demand: {
    label: string;
    anchorLow: string;
    anchorHigh: string;
    value: number;
    onChange: (value: number) => void;
  };
  capacity: {
    label: string;
    anchorLow: string;
    anchorHigh: string;
    value: number;
    onChange: (value: number) => void;
  };
}

// Moved outside component — this array is constant and needs no re-creation.
const SCALE_TICKS = [0, 2, 4, 6, 8, 10];

function SliderRow({
  label,
  anchorLow,
  anchorHigh,
  value,
  onChange,
  variant,
}: {
  label: string;
  anchorLow: string;
  anchorHigh: string;
  value: number;
  onChange: (v: number) => void;
  variant: "demand" | "capacity";
}) {
  const thumbColor = variant === "demand" ? "#588157" : "#344e41";
  const trackColor =
    variant === "demand" ? "rgba(88,129,87,0.25)" : "rgba(52,78,65,0.2)";

  return (
    <div style={{ marginBottom: "8px" }}>
      {/* Row label + value */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            textTransform: "uppercase" as const,
            letterSpacing: "0.12em",
            fontWeight: 600,
            color: thumbColor,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: thumbColor,
            lineHeight: 1,
            minWidth: "28px",
            textAlign: "right" as const,
          }}
        >
          {value}
        </span>
      </div>

      {/* Anchor labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        {[anchorLow, anchorHigh].map((anchor, i) => (
          <span
            key={i}
            style={{
              fontSize: "9px",
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              color: "rgba(52,78,65,0.5)",
              fontWeight: 500,
              maxWidth: "40%",
              textAlign: i === 1 ? ("right" as const) : undefined,
            }}
          >
            {anchor}
          </span>
        ))}
      </div>

      {/* Slider input */}
      <div style={{ position: "relative" }}>
        <style>{`
          .slider-${variant} {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 2px;
            background: ${trackColor};
            outline: none;
            cursor: pointer;
            border-radius: 0;
          }
          .slider-${variant}::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            background: ${thumbColor};
            cursor: pointer;
            border-radius: 0;
            border: 3px solid #dad7cd;
            box-shadow: 0 0 0 2px ${thumbColor};
          }
          .slider-${variant}::-moz-range-thumb {
            width: 22px;
            height: 22px;
            background: ${thumbColor};
            cursor: pointer;
            border-radius: 0;
            border: 3px solid #dad7cd;
            box-shadow: 0 0 0 2px ${thumbColor};
          }
          @media (pointer: coarse) {
            .slider-${variant}::-webkit-slider-thumb {
              width: 28px;
              height: 28px;
            }
            .slider-${variant}::-moz-range-thumb {
              width: 28px;
              height: 28px;
            }
          }
        `}</style>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`slider-${variant}`}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={value}
        />
        {/* Scale ticks — SCALE_TICKS is a module-level constant */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          {SCALE_TICKS.map((tick) => (
            <span
              key={tick}
              style={{
                fontSize: "8px",
                color: "rgba(52,78,65,0.35)",
                fontWeight: 500,
              }}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PairedSlider({
  dimensionNumber,
  dimensionName,
  question,
  description,
  demand,
  capacity,
}: PairedSliderProps) {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(52,78,65,0.2)",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      {/* Dimension header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              color: "rgba(52,78,65,0.15)",
              lineHeight: 1,
            }}
          >
            {dimensionNumber}
          </span>
          <span
            style={{
              fontSize: "10px",
              textTransform: "uppercase" as const,
              letterSpacing: "0.12em",
              fontWeight: 600,
              color: "#344e41",
            }}
          >
            {dimensionName}
          </span>
        </div>
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "#344e41",
            marginBottom: "10px",
            maxWidth: "560px",
          }}
        >
          {question}
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#588157",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>

      {/* Sliders */}
      <div
        style={{
          backgroundColor: "rgba(163,177,138,0.08)",
          border: "1px solid rgba(52,78,65,0.12)",
          padding: "28px",
        }}
      >
        <SliderRow
          label={demand.label}
          anchorLow={demand.anchorLow}
          anchorHigh={demand.anchorHigh}
          value={demand.value}
          onChange={demand.onChange}
          variant="demand"
        />

        <div
          style={{
            borderTop: "1px solid rgba(52,78,65,0.12)",
            margin: "20px 0",
          }}
        />

        <SliderRow
          label={capacity.label}
          anchorLow={capacity.anchorLow}
          anchorHigh={capacity.anchorHigh}
          value={capacity.value}
          onChange={capacity.onChange}
          variant="capacity"
        />

        {/* Gap bar */}
        <div
          style={{
            borderTop: "1px solid rgba(52,78,65,0.12)",
            paddingTop: "20px",
            marginTop: "20px",
          }}
        >
          <GapBar demand={demand.value} capacity={capacity.value} />
        </div>
      </div>
    </div>
  );
}
