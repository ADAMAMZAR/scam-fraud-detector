import { useState } from "react";
import { TACTIC_META } from "../constants/config";
import { intensityToColor } from "../utils/formatters";

// ── Tactic pill colours for chips that fall outside TACTIC_META ────────────
const FALLBACK_CHIP = { color: "#6B7280", bg: "#F3F4F6", label: null };

function getTacticMeta(tactic) {
  if (!tactic || tactic === "NEUTRAL") return null;
  // Try exact match first
  if (TACTIC_META[tactic]) return TACTIC_META[tactic];
  // Try mapping some Gemini label aliases
  const alias = {
    URGENCY_THREAT:  { label: "Urgency Threat",  color: "#EF4444", bg: "#FEF2F2" },
    FEAR_APPEAL:     { label: "Fear Appeal",      color: "#DC2626", bg: "#FFF1F2" },
    REWARD_LURE:     { label: "Reward Lure",      color: "#F59E0B", bg: "#FFFBEB" },
    SOCIAL_PROOF:    { label: "Social Proof",     color: "#3B82F6", bg: "#EFF6FF" },
    PRIZE_LURE:      { label: "Prize Lure",       color: "#F59E0B", bg: "#FFFBEB" },
  };
  return alias[tactic] || { label: tactic.replace(/_/g, " "), ...FALLBACK_CHIP };
}

// ── Single sentence span ──────────────────────────────────────────────────────
function HeatSentence({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const meta = getTacticMeta(item.tactic);
  const bg   = intensityToColor(item.intensity);
  const delay = index * 60;

  return (
    <span
      style={{
        position:       "relative",
        display:        "inline",
        backgroundColor: bg,
        borderRadius:   "4px",
        padding:        "1px 3px",
        cursor:         meta ? "pointer" : "default",
        transition:     "background-color 0.2s",
        opacity:        0,
        animation:      `sentenceIn 0.35s ease forwards`,
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.sentence}{" "}

      {/* Tactic chip (shown inline after sentence when relevant) */}
      {meta && (
        <span
          style={{
            display:       "inline-block",
            fontSize:      "9px",
            fontWeight:    "700",
            letterSpacing: "0.04em",
            padding:       "1px 6px",
            borderRadius:  "10px",
            background:    meta.bg,
            color:         meta.color,
            border:        `1px solid ${meta.color}33`,
            verticalAlign: "middle",
            marginLeft:    "3px",
            marginRight:   "4px",
            whiteSpace:    "nowrap",
            lineHeight:    "1.8",
          }}
        >
          {meta.label}
        </span>
      )}

      {/* Tooltip */}
      {hovered && meta && item.explanation && (
        <span
          style={{
            position:     "absolute",
            bottom:       "calc(100% + 8px)",
            left:         "50%",
            transform:    "translateX(-50%)",
            zIndex:       50,
            width:        "220px",
            background:   "#1E293B",
            color:        "#F8FAFC",
            borderRadius: "10px",
            padding:      "10px 12px",
            boxShadow:    "0 8px 24px rgba(0,0,0,0.25)",
            pointerEvents:"none",
            animation:    "tooltipIn 0.15s ease",
          }}
        >
          {/* Tactic label */}
          <div
            style={{
              fontSize:      "11px",
              fontWeight:    "700",
              color:         meta.color,
              marginBottom:  "4px",
              letterSpacing: "0.03em",
            }}
          >
            {meta.label}
          </div>
          {/* Explanation */}
          <div style={{ fontSize: "12px", lineHeight: "1.5", color: "#CBD5E1" }}>
            {item.explanation}
          </div>
          {/* Intensity */}
          <div
            style={{
              fontSize:   "10px",
              color:      "#94A3B8",
              marginTop:  "6px",
              fontWeight: "600",
            }}
          >
            Intensity: {(item.intensity * 100).toFixed(0)}%
          </div>
          {/* Arrow */}
          <span
            style={{
              position:    "absolute",
              top:         "100%",
              left:        "50%",
              transform:   "translateX(-50%)",
              width:       0,
              height:      0,
              borderLeft:  "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop:   "6px solid #1E293B",
            }}
          />
        </span>
      )}
    </span>
  );
}

// ── Tactic legend panel ───────────────────────────────────────────────────────
function TacticLegend({ tactics }) {
  // Count occurrences of each tactic
  const counts = {};
  tactics.forEach((t) => {
    if (t && t !== "NEUTRAL") {
      counts[t] = (counts[t] || 0) + 1;
    }
  });

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;

  return (
    <div
      style={{
        marginTop:    "20px",
        padding:      "14px 16px",
        background:   "#F8FAFC",
        border:       "1px solid #E2E8F0",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize:      "10px",
          fontWeight:    "700",
          letterSpacing: "0.07em",
          color:         "#94A3B8",
          marginBottom:  "10px",
        }}
      >
        DETECTED TACTICS
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {entries.map(([tactic, count]) => {
          const meta = getTacticMeta(tactic);
          if (!meta) return null;
          return (
            <div
              key={tactic}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "6px",
                padding:      "5px 10px",
                borderRadius: "20px",
                background:   meta.bg,
                border:       `1px solid ${meta.color}44`,
              }}
            >
              <div
                style={{
                  width:        "8px",
                  height:       "8px",
                  borderRadius: "50%",
                  background:   meta.color,
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontSize:   "11px",
                  fontWeight: "600",
                  color:      meta.color,
                }}
              >
                {meta.label}
              </span>
              <span
                style={{
                  fontSize:      "10px",
                  fontWeight:    "700",
                  color:         meta.color,
                  background:    `${meta.color}22`,
                  borderRadius:  "10px",
                  padding:       "1px 6px",
                  marginLeft:    "2px",
                }}
              >
                ×{count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Intensity legend ──────────────────────────────────────────────────────────
function IntensityLegend() {
  const steps = [
    { label: "Neutral",  color: "rgba(226,232,240,0.50)" },
    { label: "Mild",     color: "rgba(34,197,94,0.30)"   },
    { label: "Moderate", color: "rgba(250,204,21,0.40)"  },
    { label: "High",     color: "rgba(249,115,22,0.55)"  },
    { label: "Extreme",  color: "rgba(239,68,68,0.65)"   },
  ];

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
      {steps.map((s) => (
        <div
          key={s.label}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <div
            style={{
              width:        "12px",
              height:       "12px",
              borderRadius: "3px",
              background:   s.color,
              border:       "1px solid #CBD5E1",
            }}
          />
          <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "500" }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main HeatmapPanel component ───────────────────────────────────────────────
export function HeatmapPanel({ heatmap }) {
  if (!heatmap || heatmap.length === 0) return null;

  const allTactics = heatmap.map((h) => h.tactic);

  return (
    <div
      style={{
        marginTop:    "20px",
        borderRadius: "14px",
        border:       "1.5px solid #E2E8F0",
        overflow:     "hidden",
        background:   "#FFFFFF",
        boxShadow:    "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      <style>{`
        @keyframes sentenceIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding:      "14px 20px",
          background:   "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          display:      "flex",
          alignItems:   "center",
          gap:          "10px",
        }}
      >
        <span style={{ fontSize: "18px" }}>🌡️</span>
        <div>
          <div
            style={{
              fontSize:      "14px",
              fontWeight:    "700",
              color:         "#F8FAFC",
              letterSpacing: "-0.01em",
            }}
          >
            Pressure Heatmap
          </div>
          <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "1px" }}>
            Sentence-by-sentence manipulation intensity · hover for tactic details
          </div>
        </div>
      </div>

      {/* Heatmap body */}
      <div style={{ padding: "20px" }}>

        {/* Intensity legend */}
        <IntensityLegend />

        {/* Sentences */}
        <div
          style={{
            marginTop:  "16px",
            lineHeight: "2.2",
            fontSize:   "14px",
            color:      "#1E293B",
            fontFamily: "inherit",
          }}
        >
          {heatmap.map((item, i) => (
            <HeatSentence key={i} item={item} index={i} />
          ))}
        </div>

        {/* Tactic legend */}
        <TacticLegend tactics={allTactics} />
      </div>
    </div>
  );
}
