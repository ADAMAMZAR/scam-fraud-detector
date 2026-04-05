import { useState } from "react";

const EXAMPLES = [
  {
    label: "Phishing SMS",
    channel: "text",
    message:
      "URGENT: Your Maybank account has been suspended. Verify your details immediately or lose access: http://maybank-secure-verify.xyz/login",
  },
  {
    label: "Scam Email",
    channel: "text",
    message:
      "Congratulations! You have been selected to receive RM5,000 from the Malaysian Government Relief Fund. Click here to claim before it expires in 24 hours: bit.ly/claim-relief",
  },
  {
    label: "Legit Message",
    channel: "text",
    message:
      "Hi, your order #MYS-2048 has been shipped and will arrive by Thursday. Track your parcel at poslaju.com.my using your tracking number JX209481.",
  },
];

// ── Fully explicit colors — no CSS variables inside result card ──────────────
const RISK = {
  Safe: {
    bg:         "#F0FDF4",
    bannerText: "#14532D",
    scoreColor: "#16A34A",
    barColor:   "#22C55E",
    border:     "#86EFAC",
    badgeBg:    "#DCFCE7",
    badgeText:  "#166534",
    reasonBg:   "#F0FDF4",
    reasonBorder:"#BBF7D0",
    shapeBar:   "#22C55E",
    label:      "Safe",
    emoji:      "✅",
  },
  Suspicious: {
    bg:         "#FFFBEB",
    bannerText: "#78350F",
    scoreColor: "#D97706",
    barColor:   "#F59E0B",
    border:     "#FCD34D",
    badgeBg:    "#FEF3C7",
    badgeText:  "#92400E",
    reasonBg:   "#FFFBEB",
    reasonBorder:"#FDE68A",
    shapeBar:   "#F59E0B",
    label:      "Suspicious",
    emoji:      "⚠️",
  },
  Fraud: {
    bg:         "#FFF1F2",
    bannerText: "#881337",
    scoreColor: "#DC2626",
    barColor:   "#EF4444",
    border:     "#FCA5A5",
    badgeBg:    "#FFE4E6",
    badgeText:  "#9F1239",
    reasonBg:   "#FFF1F2",
    reasonBorder:"#FECDD3",
    shapeBar:   "#EF4444",
    label:      "Fraud",
    emoji:      "🚨",
  },
};

function getRiskKey(score) {
  if (score >= 75) return "Fraud";
  if (score >= 40) return "Suspicious";
  return "Safe";
}

// ── Gauge bar ─────────────────────────────────────────────────────────────────
function GaugeBar({ score }) {
  const key = getRiskKey(score);
  const r   = RISK[key];

  return (
    <div style={{ marginBottom: "20px" }}>

      {/* Label + big number */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "10px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.06em",
              color: "#6B7280",
              marginBottom: "2px",
            }}
          >
            RISK SCORE
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "20px",
              background: r.badgeBg,
              border: `1px solid ${r.border}`,
            }}
          >
            <span style={{ fontSize: "13px" }}>{r.emoji}</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: r.badgeText,
              }}
            >
              {r.label}
            </span>
          </div>
        </div>

        {/* Score number — large, always readable */}
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "800",
              color: r.scoreColor,
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "400",
              color: "#9CA3AF",
              marginLeft: "2px",
            }}
          >
            / 100
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: "12px",
          borderRadius: "6px",
          background: "#F3F4F6",
          overflow: "hidden",
          border: "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            borderRadius: "6px",
            background: r.barColor,
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      {/* Zone markers */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "6px",
        }}
      >
        {[
          { label: "Safe",       range: "0",  color: "#16A34A" },
          { label: "Suspicious", range: "40", color: "#D97706" },
          { label: "Fraud",      range: "75", color: "#DC2626" },
          { label: "",           range: "100",color: "#6B7280" },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: m.color,
              }}
            />
            <span style={{ fontSize: "10px", color: "#6B7280", fontWeight: "500" }}>
              {m.range}{m.label ? ` ${m.label}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reason row ────────────────────────────────────────────────────────────────
function ReasonRow({ reason, colors, maxPoints = 40 }) {
  const pct = Math.min((reason.points / maxPoints) * 100, 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 14px",
        borderRadius: "10px",
        background: colors.reasonBg,
        border: `1px solid ${colors.reasonBorder}`,
      }}
    >
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "3px",
          }}
        >
          {reason.text}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#6B7280",
            fontWeight: "500",
          }}
        >
          {reason.category}
        </div>
      </div>

      {/* SHAP mini bar + points */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: colors.scoreColor,
          }}
        >
          +{reason.points} pts
        </span>
        <div
          style={{
            width: "72px",
            height: "6px",
            borderRadius: "3px",
            background: "#E5E7EB",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: "3px",
              background: colors.shapeBar,
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ result }) {
  const key    = getRiskKey(result.score);
  const colors = RISK[key];
  const [copied, setCopied] = useState(false);

  function copyReport() {
    const text = [
      "═══════════════════════════",
      "  SCAM DETECTION REPORT",
      "═══════════════════════════",
      `Score      : ${result.score} / 100`,
      `Label      : ${colors.label}`,
      `Confidence : ${result.confidence}%`,
      "",
      "── Why flagged ──",
      ...result.reasons.map((r) => `• ${r.text}  (+${r.points} pts)`),
      "",
      "── Score breakdown ──",
      ...Object.entries(result.breakdown).map(
        ([k, v]) => `• ${k}: ${v} pts`
      ),
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      style={{
        marginTop: "24px",
        borderRadius: "14px",
        overflow: "hidden",
        border: `2px solid ${colors.border}`,
        background: "#FFFFFF",
        boxShadow: `0 4px 24px ${colors.barColor}22`,
        animation: "resultIn 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        @keyframes resultIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Banner ── */}
      <div
        style={{
          background: colors.bg,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1.5px solid ${colors.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px", lineHeight: 1 }}>{colors.emoji}</span>
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "800",
                color: colors.bannerText,
                letterSpacing: "-0.02em",
              }}
            >
              {colors.label.toUpperCase()} DETECTED
            </div>
            <div
              style={{
                fontSize: "12px",
                color: colors.bannerText,
                opacity: 0.7,
                fontWeight: "500",
                marginTop: "2px",
              }}
            >
              {result.confidence}% model confidence
            </div>
          </div>
        </div>

        <button
          onClick={copyReport}
          style={{
            fontSize: "12px",
            padding: "7px 14px",
            borderRadius: "8px",
            border: `1.5px solid ${colors.border}`,
            background: copied ? colors.badgeBg : "transparent",
            color: colors.bannerText,
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.15s",
          }}
        >
          {copied ? "✓ Copied!" : "📋 Copy Report"}
        </button>
      </div>

      {/* ── Score gauge ── */}
      <div style={{ padding: "20px 20px 0" }}>
        <GaugeBar score={result.score} />
      </div>

      {/* ── Why flagged ── */}
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.06em",
            color: "#6B7280",
            marginBottom: "10px",
          }}
        >
          WHY THIS WAS FLAGGED
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {result.reasons.map((r, i) => (
            <ReasonRow key={i} reason={r} colors={colors} />
          ))}
        </div>

        {/* ── Score breakdown ── */}
        {result.breakdown && (
          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                color: "#6B7280",
                marginBottom: "10px",
              }}
            >
              SCORE BREAKDOWN
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {Object.entries(result.breakdown).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    flex: 1,
                    padding: "12px 10px",
                    borderRadius: "10px",
                    background: v > 20 ? colors.badgeBg : "#F9FAFB",
                    border: `1px solid ${v > 20 ? colors.border : "#E5E7EB"}`,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "800",
                      color: v > 20 ? colors.scoreColor : "#374151",
                      lineHeight: 1,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#6B7280",
                      marginTop: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {k}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Using Gemini AI for analysis now

// ── Main page ─────────────────────────────────────────────────────────────────
export function AnalysePage() {
  const [channel,  setChannel]  = useState("text");
  const [message,  setMessage]  = useState("");
  const [url,      setUrl]      = useState("");
  const [fileName, setFileName] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState("");

  async function handleAnalyse() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message || url,
          channel: channel === "url" ? "url" : channel,
          sender: channel === "url" ? url : "User Upload"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Failed to connect to the analysis server. Is your FastAPI running?");
    } finally {
      setLoading(false);
    }
  }

  function handleExample(ex) {
    setChannel(ex.channel);
    setMessage(ex.message);
    setResult(null);
    setError("");
  }

  function handleFileRead(file) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setMessage(e.target.result);
    reader.readAsText(file);
  }

  const canAnalyse =
    (channel === "url" && url.trim()) ||
    (channel !== "url" && message.trim());

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Example buttons ── */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.06em",
            color: "#6B7280",
            marginBottom: "8px",
          }}
        >
          TRY AN EXAMPLE
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex)}
              style={{
                fontSize: "12px",
                padding: "7px 16px",
                borderRadius: "20px",
                border: "1.5px solid #E5E7EB",
                background: "#F9FAFB",
                color: "#374151",
                cursor: "pointer",
                fontWeight: "500",
                transition: "all 0.15s",
              }}
            >
              {ex.label === "Phishing SMS"  && "🎣 "}
              {ex.label === "Scam Email"    && "📧 "}
              {ex.label === "Legit Message" && "✅ "}
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input card ── */}
      <div className="card">
        <h2 style={{ marginBottom: "20px", color: "#111827" }}>
          Analyse Message
        </h2>

        {/* Channel tabs */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.06em",
              color: "#6B7280",
              marginBottom: "8px",
            }}
          >
            SELECT CHANNEL
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "text", icon: "✏️", label: "Text"  },
              { id: "file", icon: "📁", label: "File"  },
              { id: "url",  icon: "🔗", label: "URL"   },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setChannel(ch.id);
                  setMessage("");
                  setUrl("");
                  setFileName("");
                  setResult(null);
                }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: `1.5px solid ${channel === ch.id ? "#6366F1" : "#E5E7EB"}`,
                  background: channel === ch.id ? "#EEF2FF" : "#F9FAFB",
                  color: channel === ch.id ? "#4338CA" : "#374151",
                  fontWeight: channel === ch.id ? "700" : "400",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {ch.icon} {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text */}
        {channel === "text" && (
          <div style={{ marginBottom: "20px" }}>
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
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.06em",
                  color: "#6B7280",
                }}
              >
                MESSAGE BODY
              </span>
              {message && (
                <button
                  onClick={() => { setMessage(""); setResult(null); }}
                  style={{
                    fontSize: "11px",
                    color: "#9CA3AF",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); setResult(null); }}
              placeholder="Paste your message here..."
              rows={5}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1.5px solid #E5E7EB",
                background: "#F9FAFB",
                color: "#111827",
                fontSize: "14px",
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: "1.6",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                fontSize: "11px",
                color: "#9CA3AF",
                marginTop: "4px",
                textAlign: "right",
              }}
            >
              {message.length} characters
            </div>
          </div>
        )}

        {/* File */}
        {channel === "file" && (
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                color: "#6B7280",
                display: "block",
                marginBottom: "8px",
              }}
            >
              UPLOAD FILE
            </span>
            <label
              style={{
                display: "block",
                border: "2px dashed #D1D5DB",
                borderRadius: "12px",
                padding: "32px",
                textAlign: "center",
                cursor: "pointer",
                background: "#F9FAFB",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>📂</div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                {fileName || "Click to upload"}
              </div>
              <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                .txt · .csv · .json · .eml
              </div>
              <input
                type="file"
                accept=".txt,.csv,.json,.eml"
                onChange={(e) => handleFileRead(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            {message && (
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                  color: "#374151",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>
        )}

        {/* URL */}
        {channel === "url" && (
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                color: "#6B7280",
                display: "block",
                marginBottom: "8px",
              }}
            >
              ENTER URL
            </span>
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setResult(null); }}
              placeholder="https://suspicious-site.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1.5px solid #E5E7EB",
                background: "#F9FAFB",
                color: "#111827",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px" }}>
              Checks domain age, blacklist, and redirect chains
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "8px",
              background: "#FFF1F2",
              color: "#9F1239",
              fontSize: "13px",
              fontWeight: "500",
              marginBottom: "16px",
              border: "1px solid #FECDD3",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Analyse button */}
        <button
          onClick={handleAnalyse}
          disabled={!canAnalyse || loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background:
              !canAnalyse || loading ? "#E5E7EB" : "#6366F1",
            color:
              !canAnalyse || loading ? "#9CA3AF" : "#FFFFFF",
            fontSize: "15px",
            fontWeight: "700",
            cursor: !canAnalyse || loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            letterSpacing: "-0.01em",
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  border: "2.5px solid #FFFFFF44",
                  borderTop: "2.5px solid #FFFFFF",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Analysing...
            </>
          ) : (
            "🔍 Analyse Message"
          )}
        </button>
      </div>

      {/* Result card */}
      {result && <ResultCard result={result} />}
    </div>
  );
}