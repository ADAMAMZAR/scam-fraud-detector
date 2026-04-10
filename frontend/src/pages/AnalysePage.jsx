import { useState } from "react";
import { HeatmapPanel } from "../components/HeatmapPanel";

const EXAMPLES = [
  {
    label: "Phishing SMS",
    channel: "text",
    message:
      "URGENT: Your Maybank account has been suspended. Verify your details immediately or lose access: http://maybank-secure-verify.xyz/login",
  },
  {
    label: "Scam Email",
    channel: "email",
    sender: "gov-relief@lottery-winner.net",
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

const DEMO_POOL = {
  text: [
    { message: "URGENT: Abnormal activity detected on your account. Please re-verify to avoid permanent suspension: bit.ly/secure-bank-access" },
    { message: "Congratulations! You've won a RM1,000 Shopee voucher. Claim your lucky prize here: http://shopee-win-claim.com/promo" },
    { message: "POLICE DEPT: You have an unpaid traffic fine of RM300. Pay within 24 hours to avoid court summons: http://pdrm-web-portal.net/fines" },
    { message: "RM0.00 BANK ALERT: Your transaction of RM1,500 to 'Lazada Pay' is pending. Not you? Report at: http://secure-alert-bank.xyz" }
  ],
  email: [
    { sender: "admin-support@secure-update.net", message: "Your Microsoft Outlook account will be deactivated in 4 hours due to security breaches. Log in here to resolve: http://office365-verify-access.com" },
    { sender: "ceo.office@company-corp.com", message: "Hi, I'm stuck in a meeting. Can you quickly buy 5x RM200 Steam gift cards and send me the codes? I'll reimburse you by end of day. Urgent!" },
    { sender: "noreply@tax-refund-gov.my", message: "You have a pending LHDN tax refund of RM842.50. Please provide your bank credentials to process the transfer: http://refund-lhdn-portal.org/claim" }
  ],
  url: [
    { url: "http://legit-banking-secure.xyz/login" },
    { url: "http://verify-my-account-now.info" },
    { url: "http://malaysia-gov-aid.cc/apply" },
    { url: "http://shopee-rewards-2024.net" }
  ]
};

// ── Fully explicit colors — no CSS variables inside result card ──────────────
const RISK = {
  Safe: {
    bg:         "rgba(16, 185, 129, 0.05)",
    bannerText: "var(--green)",
    scoreColor: "var(--green)",
    barColor:   "var(--green)",
    border:     "rgba(16, 185, 129, 0.2)",
    badgeBg:    "rgba(16, 185, 129, 0.1)",
    badgeText:  "var(--green)",
    reasonBg:   "var(--bg-hover)",
    reasonBorder:"var(--border)",
    shapeBar:   "var(--green)",
    label:      "Safe",
    emoji:      "✅",
  },
  Suspicious: {
    bg:         "rgba(245, 158, 11, 0.05)",
    bannerText: "var(--amber)",
    scoreColor: "var(--amber)",
    barColor:   "var(--amber)",
    border:     "rgba(245, 158, 11, 0.2)",
    badgeBg:    "rgba(245, 158, 11, 0.1)",
    badgeText:  "var(--amber)",
    reasonBg:   "var(--bg-hover)",
    reasonBorder:"var(--border)",
    shapeBar:   "var(--amber)",
    label:      "Suspicious",
    emoji:      "⚠️",
  },
  Fraud: {
    bg:         "rgba(239, 68, 68, 0.05)",
    bannerText: "var(--red)",
    scoreColor: "var(--red)",
    barColor:   "var(--red)",
    border:     "rgba(239, 68, 68, 0.2)",
    badgeBg:    "rgba(239, 68, 68, 0.1)",
    badgeText:  "var(--red)",
    reasonBg:   "var(--bg-hover)",
    reasonBorder:"var(--border)",
    shapeBar:   "var(--red)",
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
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--text)",
            marginBottom: "3px",
          }}
        >
          {reason.text}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--text3)",
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
        border: `1.5px solid ${colors.border}`,
        background: "var(--surface)",
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
  const [senderEmail, setSenderEmail] = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState("");

  async function handleAnalyse() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      let response;
      if (channel === "image") {
        // Multipart form-data for image upload
        const formData = new FormData();
        formData.append("file", imageFile);
        response = await fetch("http://localhost:8000/analyze-image", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: message || url,
            channel: channel,
            sender: channel === "url" ? url : (channel === "email" ? senderEmail : "User Upload")
          }),
        });
      }

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
    if (ex.channel === "url") setUrl(ex.message);
    if (ex.channel === "email") {
      setSenderEmail(ex.sender || "support@suspicious-bank.com");
    }
    setResult(null);
    setError("");
  }

  function handleImageSelect(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  }

  async function handleQuickDemo() {
    setError("");
    setResult(null);

    if (channel === "image") {
      try {
        setLoading(true);
        // Try popular extensions
        let demoUrl = "/demo-data/image-test.png";
        let res = await fetch(demoUrl);
        if (!res.ok) {
          demoUrl = "/demo-data/image-test.jpg";
          res = await fetch(demoUrl);
        }
        if (!res.ok) {
          demoUrl = "/demo-data/image-test.jpeg";
          res = await fetch(demoUrl);
        }
        
        if (!res.ok) throw new Error("Demo image not found in /public/demo-data/. Please add 'image-test.png' or '.jpg'");
        
        const blob = await res.blob();
        const file = new File([blob], demoUrl.split('/').pop(), { type: blob.type });
        handleImageSelect(file);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    const pool = DEMO_POOL[channel] || [];
    if (pool.length === 0) return;

    const random = pool[Math.floor(Math.random() * pool.length)];
    if (channel === "text") {
      setMessage(random.message);
    } else if (channel === "email") {
      setSenderEmail(random.sender);
      setMessage(random.message);
    } else if (channel === "url") {
      setUrl(random.url);
    }
  }

  const canAnalyse =
    (channel === "url" && url.trim()) ||
    (channel === "email" && senderEmail.trim() && message.trim()) ||
    (channel === "text" && message.trim()) ||
    (channel === "image" && imageFile !== null);

  return (
    <div>
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
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex)}
              style={{
                fontSize: "12px",
                padding: "7px 16px",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                background: "var(--bg-hover)",
                color: "var(--text2)",
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

          <div style={{ width: "1px", height: "18px", background: "var(--border)", margin: "0 4px" }} />

          <button
            onClick={handleQuickDemo}
            disabled={loading}
            style={{
              fontSize: "12px",
              padding: "7px 16px",
              borderRadius: "20px",
              border: "1.5px solid var(--primary)",
              background: "var(--primary-dim)",
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: "700",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            ✨ Quick Demo ({channel.toUpperCase()})
          </button>
        </div>
      </div>

      {/* ── Input card ── */}
      <div className="card">
        <h2 style={{ marginBottom: "20px" }}>
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
              { id: "text",  icon: "✏️", label: "Text"  },
              { id: "email", icon: "📧", label: "Email" },
              { id: "url",   icon: "🔗", label: "URL"   },
              { id: "image", icon: "🖼️", label: "Image" },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setChannel(ch.id);
                  setMessage("");
                  setUrl("");
                  setSenderEmail("");
                  setImageFile(null);
                  setImagePreview(null);
                  setResult(null);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1.5px solid",
                  borderColor: channel === ch.id ? "var(--primary)" : "var(--border)",
                  background: channel === ch.id ? "var(--primary-dim)" : "var(--surface)",
                  color: channel === ch.id ? "var(--primary)" : "var(--text2)",
                  fontWeight: channel === ch.id ? "700" : "500",
                  fontSize: "14px",
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
                border: "1px solid var(--border)",
                background: "var(--bg-input)",
                color: "var(--text)",
                fontSize: "15px",
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: "1.6",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-dim)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
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

        {/* File
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
              <input
                type="file"
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
        )} */}

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

        {/* Image */}
        {channel === "image" && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", color: "#6B7280" }}>
                UPLOAD SCREENSHOT
              </span>
              {imageFile && (
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); setResult(null); }}
                  style={{ fontSize: "11px", color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: "2px dashed",
                borderColor: isDragging || imageFile ? "var(--primary)" : "var(--border2)",
                borderRadius: "14px",
                padding: imagePreview ? "16px" : "48px 24px",
                textAlign: "center",
                background: isDragging ? "var(--primary-dim)" : imageFile ? "rgba(37, 99, 235, 0.02)" : "var(--bg-hover)",
                transition: "all 0.2s",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => !imageFile && document.getElementById("img-upload-input").click()}
            >
              {imagePreview ? (
                <div style={{ display: "flex", alignItems: "center", gap: "20px", textAlign: "left" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "140px",
                      height: "140px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-sm)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text)", marginBottom: "4px" }}>
                      {imageFile.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "12px" }}>
                      {(imageFile.size / 1024).toFixed(1)} KB · {imageFile.type}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600" }}>
                      ✓ Screenshot ready for analysis
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📸</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", marginBottom: "6px" }}>
                    {isDragging ? "Drop screenshot here" : "Upload screenshot for analysis"}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "20px" }}>
                    WhatsApp, SMS, or Email — JPG/PNG/WEBP
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); document.getElementById("img-upload-input").click(); }}
                    className="topbar-btn primary"
                    style={{ padding: "10px 24px", fontSize: "14px" }}
                  >
                    Select Screenshot
                  </button>
                </>
              )}
              <input
                id="img-upload-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageSelect(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px" }}>
              Gemini Vision will extract text and analyze the screenshot for scam indicators
            </div>
          </div>
        )}

        {/* Email */}
        {channel === "email" && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
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
                SENDER EMAIL
              </span>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => { setSenderEmail(e.target.value); setResult(null); }}
                placeholder="e.g. support@verify-security.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-input)",
                  color: "var(--text)",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            
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
                EMAIL CONTENT
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
              placeholder="Paste the email body here..."
              rows={5}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg-input)",
                color: "var(--text)",
                fontSize: "15px",
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: "1.6",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
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
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            background: !canAnalyse || loading ? "var(--border)" : "var(--primary)",
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: "700",
            cursor: !canAnalyse || loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: canAnalyse && !loading ? "var(--shadow)" : "none",
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Analysing...
            </>
          ) : (
            <>🔍 Start Scam Analysis</>
          )}
        </button>
      </div>

      {/* Result card */}
      {result && <ResultCard result={result} />}

      {/* Pressure Heatmap */}
      {result && result.heatmap && result.heatmap.length > 0 && (
        <HeatmapPanel heatmap={result.heatmap} />
      )}
      {!loading && !result && (
        <div style={{ marginTop: 48, borderTop: "1px solid var(--border)", paddingTop: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
              What does Fraud Detector analyse?
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 14, maxWidth: 520, margin: "0 auto" }}>
              Built for Malaysian users — paste any suspicious SMS, WhatsApp message, email, or link.
              Our AI detects scam patterns used by local and international fraudsters instantly.
            </p>
          </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "48px" }}>
          {[
            {
              icon: "🏦",
              title: "Bank Impersonation",
              desc: "Detects fake messages pretending to be Maybank, CIMB, or Bank Negara asking for sensitive details or login.",
            },
            {
              icon: "🎁",
              title: "Government Relief Scams",
              desc: "Identifies fraudulent offers for cash rewards, KWSP withdrawals, or LHDN relief that aim to steal your credentials.",
            },
          ].map((f) => (
            <div key={f.title} className="card" style={{ padding: "24px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>{f.title}</div>
              <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: "1.7" }}>{f.desc}</p>
            </div>
          ))}
        </div>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
              How does it work?
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>
            Powered by Gemini AI — three steps, real-time results.
          </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 48 }}>
            {[
              { step: "1", text: "Paste your message, enter a sender email, or enter a suspicious URL into the analyser above." },
              { step: "2", text: "Our AI analyses the message structure, language patterns, URLs, and sender context to identify fraud indicators." },
              { step: "3", text: "You get a risk score from 0–100, a verdict (Safe / Suspicious / Fraud), and a full breakdown of exactly why it was flagged." },
            ].map((s) => (
              <div key={s.step} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: "1.5px solid var(--cyan)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--cyan)",
                }}>
                  {s.step}
                </div>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{s.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
              Why use Fraud Detector?
            </h2>
          </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 48 }}>
          {[
            {
              title: "Built for Malaysia",
              desc: "Designed to recognise local scam patterns — Maybank phishing, LHDN impersonation, Shopee/Lazada fake sellers, and Malaysian phone number fraud.",
            },
            {
              title: "AI explainability",
              desc: "Every result includes a risk score, confidence level, and the exact reasons why the message was flagged — not just a verdict, but a full breakdown you can act on.",
            },
            {
              title: "Your scans are saved",
              desc: "Every scan is saved to your history so you can review past results, track patterns, and export records anytime from the Messages page.",
            },
          ].map((w) => (
            <div key={w.title}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{w.title}</div>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{w.desc}</p>
            </div>
          ))}
        </div>

        </div>
      )}
    </div>
  );
}