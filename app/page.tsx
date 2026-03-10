import Link from "next/link";

const S = {
  body: { backgroundColor: "#dad7cd", minHeight: "100vh" },
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
  border: "1px solid rgba(52,78,65,0.3)",
};

export default function Home() {
  return (
    <div style={S.body}>
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: S.border,
        }}
      >
        <div style={S.label}>FOUNDER_FIT</div>
        <Link
          href="/assessment"
          style={{
            backgroundColor: "#344e41",
            color: "#dad7cd",
            padding: "0.75rem 1.5rem",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          Begin Instrument
        </Link>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          borderBottom: S.border,
          minHeight: "80vh",
        }}
        className="hero-grid"
      >
        {/* Left */}
        <div
          style={{
            borderRight: S.border,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="hero-left"
        >
          <div>
            <div style={{ ...S.labelLight, marginBottom: "1.5rem" }}>
              *THE INSTRUMENT
            </div>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#344e41",
                marginBottom: "1.25rem",
                maxWidth: "400px",
              }}
            >
              Mapping where your environment and capacity are in friction.
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.55,
                color: "#588157",
                marginBottom: "2rem",
                maxWidth: "460px",
              }}
            >
              Most founder performance problems aren&apos;t about effort or
              capability. They&apos;re about structural misalignment between
              what the environment demands and what the founder can
              sustainably give. This instrument finds the gap.
            </p>
            <Link
              href="/assessment"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#344e41",
                textDecoration: "none",
                borderBottom: "2px solid #344e41",
                paddingBottom: "2px",
              }}
            >
              Begin the instrument →
            </Link>
          </div>

          <p
            style={{
              fontSize: "0.82rem",
              color: "#a3b18a",
              lineHeight: 1.5,
              marginTop: "2rem",
            }}
          >
            Takes 8–12 minutes to complete.
            <br />
            Your results are delivered to your inbox immediately.
          </p>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Stats block */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "3rem 1fr",
              borderBottom: S.border,
            }}
          >
            <div
              style={{
                borderRight: S.border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  color: "#a3b18a",
                }}
              >
                METRICS
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "2rem",
                gap: "2rem",
              }}
            >
              {[
                { num: "04", label: "Dimensions Mapped" },
                { num: "03", label: "Friction Zones Scored" },
                { num: "01", label: "Profile Generated" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom:
                      i < 2 ? "1px solid rgba(52,78,65,0.2)" : "none",
                    paddingBottom: i < 2 ? "1.5rem" : 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      color: "#344e41",
                    }}
                  >
                    {stat.num}
                  </div>
                  <div style={S.label}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Display text */}
          <div
            style={{
              padding: "2rem",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(3rem, 7vw, 7rem)",
                fontWeight: 800,
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
                textTransform: "uppercase",
                color: "#344e41",
                textAlign: "right",
              }}
            >
              FOUNDER
              <br />
              FIT
            </h1>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section style={{ borderBottom: S.border }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "3rem 2rem 2rem",
            borderBottom: S.border,
          }}
        >
          <div style={S.labelLight}>*THE METHOD</div>
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#344e41",
            }}
          >
            HOW IT WORKS
          </div>
        </div>

        {/* Steps */}
        {[
          {
            num: "01",
            title: "Map Four Dimensions",
            body: "Use paired sliders to rate what your business demands — and what you can actually give — across four core dimensions: pace, uncertainty, relational load, and novelty vs. structure.",
          },
          {
            num: "02",
            title: "Score Three Friction Zones",
            body: "The instrument calculates the gap between demand and capacity in each dimension, groups them into three friction zones, and classifies each as high, medium, or low.",
          },
          {
            num: "03",
            title: "Receive Your Profile",
            body: "Your results are emailed to you immediately. Each friction zone comes with a specific insight and a redesign direction — a concrete structural change you can make.",
          },
        ].map((step, i, arr) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              borderBottom: i < arr.length - 1 ? S.border : "none",
            }}
            className="step-row"
          >
            <div
              style={{
                borderRight: S.border,
                padding: "3rem 2rem",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 5rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  color: "rgba(52,78,65,0.2)",
                }}
              >
                {step.num}
              </span>
            </div>
            <div
              style={{
                padding: "3rem 2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#344e41",
                  marginBottom: "0.75rem",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.55,
                  color: "#588157",
                  maxWidth: "480px",
                }}
              >
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Pull quote ───────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderBottom: S.border,
        }}
      >
        <div style={{ ...S.labelLight, marginBottom: "3rem" }}>
          *THE PREMISE
        </div>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "820px",
            color: "#344e41",
            marginBottom: "2rem",
          }}
        >
          The problem is rarely a skills gap. It&apos;s almost always an
          environment-capacity mismatch that no one has named yet.
        </h2>
        <div style={S.labelLight}>FOUNDER FIT METHODOLOGY</div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section
        style={{
          padding: "4rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "2rem",
          borderBottom: S.border,
        }}
      >
        <div>
          <div style={{ ...S.labelLight, marginBottom: "1rem" }}>
            *READY TO BEGIN
          </div>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              color: "#344e41",
            }}
          >
            RUN THE
            <br />
            INSTRUMENT
          </h2>
        </div>
        <Link
          href="/assessment"
          style={{
            backgroundColor: "#344e41",
            color: "#dad7cd",
            padding: "1rem 2rem",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          Begin Now — 8 to 12 Minutes →
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer
        style={{
          padding: "3rem 2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
        className="footer-grid"
      >
        <div>
          <div
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#344e41",
              marginBottom: "0.75rem",
            }}
          >
            FOUNDER
            <br />
            FIT
          </div>
          <div style={S.labelLight}>© 2025 FOUNDER FIT</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ ...S.label, marginBottom: "0.75rem" }}>INSTRUMENT</div>
          {["Begin Assessment", "About the Method"].map((link) => (
            <a
              key={link}
              href={link === "Begin Assessment" ? "/assessment" : "#"}
              style={{ fontSize: "0.9rem", color: "#588157", padding: "4px 0" }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-left { border-right: none !important; border-bottom: 1px solid rgba(52,78,65,0.3) !important; }
          .step-row { grid-template-columns: 1fr !important; }
          .step-row > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(52,78,65,0.2) !important; padding-bottom: 0.5rem !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
