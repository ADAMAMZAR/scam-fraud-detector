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

const RISK_COLORS = {
  Safe: { bg: "#EAF3DE", color: "#27500A", border: "#639922" },
  Suspicious: { bg: "#FAEEDA", color: "#633806", border: "#BA7517" },
  Fraud: { bg: "#FCEBEB", color: "#A32D2D", border: "#E24B4A" },
};

function getRiskLabel(score) {
  if (score >= 75) return "Fraud";
  if (score >= 40) return "Suspicious";
  return "Safe";
}

function getRiskEmoji(label) {
  if (label === "Fraud") return "🚨";
  if (label === "Suspicious") return "⚠️";
  return "✅";
}

function GaugeBar({ score }) {
  const label = getRiskLabel(score);
  const colors = RISK_COLORS[label];
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--text3)",
          }}
        >
          RISK SCORE
        </span>
        <span
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: colors.border,
          }}
        >
          {score}
          <span
            style={{ fontSize: "14px", fontWeight: "400", color: "var(--text3)" }}
          >
            /100
          </span>
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "10px",
          borderRadius: "5px",
          background: "var(--bg3, #f0f0f0)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            borderRadius: "5px",
            background: colors.border,
            transition: "width 0.8s ease",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "4px",
        }}
      >
        <span style={{ fontSize: "10px", color: "var(--text3)" }}>0 Safe</span>
        <span style={{ fontSize: "10px", color: "var(--text3)" }}>
          40 Suspicious
        </span>
        <span style={{ fontSize: "10px", color: "var(--text3)" }}>
          75 Fraud
        </span>
      </div>
    </div>
  );
}

function ResultCard({ result }) {
  const label = getRiskLabel(result.score);
  const colors = RISK_COLORS[label];
  const emoji = getRiskEmoji(label);
  const [copied, setCopied] = useState(false);

  function copyReport() {
    const text = [
      `Scam Detection Report`,
      `Score: ${result.score}/100`,
      `Label: ${label}`,
      `Confidence: ${result.confidence}%`,
      ``,
      `Reasons:`,
      ...result.reasons.map((r) => `• ${r.text} (+${r.points} pts)`),
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
        border: `1.5px solid ${colors.border}`,
        borderRadius: "12px",
        overflow: "hidden",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>

      {/* Header banner */}
      <div
        style={{
          background: colors.bg,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${colors.border}22`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>{emoji}</span>
          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: colors.color,
              }}
            >
              {label.toUpperCase()} DETECTED
            </div>
            <div style={{ fontSize: "11px", color: colors.color, opacity: 0.8 }}>
              {result.confidence}% confidence
            </div>
          </div>
        </div>
        <button
          onClick={copyReport}
          style={{
            fontSize: "11px",
            padding: "5px 12px",
            borderRadius: "8px",
            border: `1px solid ${colors.border}`,
            background: "transparent",
            color: colors.color,
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {copied ? "Copied ✓" : "Copy Report"}
        </button>
      </div>

      {/* Score gauge */}
      <div style={{ padding: "18px 18px 0" }}>
        <GaugeBar score={result.score} />
      </div>

      {/* SHAP Reasons */}
      <div style={{ padding: "0 18px 18px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--text3)",
            marginBottom: "10px",
          }}
        >
          WHY THIS WAS FLAGGED
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {result.reasons.map((reason, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                background: "var(--bg2, #f8f8f8)",
                border: "0.5px solid var(--border, #e0e0e0)",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "var(--text1)",
                    marginBottom: "2px",
                  }}
                >
                  {reason.text}
                </div>
                <div style={{ fontSize: "10px", color: "var(--text3)" }}>
                  {reason.category}
                </div>
              </div>
              {/* SHAP bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    width: "60px",
                    height: "6px",
                    borderRadius: "3px",
                    background: "var(--bg3, #e8e8e8)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(reason.points / 40) * 100}%`,
                      background: colors.border,
                      borderRadius: "3px",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: colors.border,
                    minWidth: "36px",
                    textAlign: "right",
                  }}
                >
                  +{reason.points}pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Channel breakdown */}
        {result.breakdown && (
          <div style={{ marginTop: "14px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text3)",
                marginBottom: "8px",
              }}
            >
              SCORE BREAKDOWN
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {Object.entries(result.breakdown).map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: "8px",
                    background: "var(--bg2, #f8f8f8)",
                    border: "0.5px solid var(--border)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "var(--text1)",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text3)",
                      textTransform: "capitalize",
                    }}
                  >
                    {key}
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

// Simulate API call — replace with real fetch to FastAPI
async function analyseMessage({ channel, message, url }) {
  await new Promise((r) => setTimeout(r, 1500));

  const text = message || url || "";
  const isScam =
    /urgent|suspended|verify|click|claim|free|won|prize|password|account|bank|login/i.test(
      text
    );
  const isPhishing =
    /bit\.ly|xyz|verify|secure|login|claim|relief/i.test(text);

  const nlpScore = isScam ? 52 : 12;
  const urlScore = isPhishing ? 28 : 4;
  const senderScore = isScam ? 10 : 2;
  const total = Math.min(nlpScore + urlScore + senderScore, 100);

  return {
    score: total,
    confidence: Math.round(72 + Math.random() * 20),
    breakdown: {
      NLP: nlpScore,
      URL: urlScore,
      Sender: senderScore,
    },
    reasons: isScam
      ? [
          { text: "Urgency language detected", category: "NLP · Intent", points: 38 },
          { text: "Suspicious URL pattern", category: "URL · Domain", points: 28 },
          { text: "Known scam phrase match", category: "NLP · Keywords", points: 21 },
        ]
      : [
          { text: "No urgency language found", category: "NLP · Intent", points: 2 },
          { text: "Domain appears legitimate", category: "URL · Domain", points: 4 },
          { text: "No blacklist match", category: "Sender · Reputation", points: 2 },
        ],
  };
}

export function AnalysePage() {
  const [channel, setChannel] = useState("text");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleAnalyse() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await analyseMessage({ channel, message, url });
      setResult(data);
      // Save to localStorage history
      const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
      history.unshift({
        id: Date.now(),
        channel,
        preview: (message || url).slice(0, 80),
        score: data.score,
        label: getRiskLabel(data.score),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("scanHistory", JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      setError("Failed to connect to the analysis server. Is your FastAPI running?");
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

      {/* Example buttons */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--text3)",
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
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--text2)",
                cursor: "pointer",
                fontWeight: "500",
                transition: "all 0.15s",
              }}
            >
              {ex.label === "Phishing SMS" && "🎣 "}
              {ex.label === "Scam Email" && "📧 "}
              {ex.label === "Legit Message" && "✅ "}
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "20px" }}>Analyse Message</h2>

        {/* Channel selector */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--text3)",
            }}
          >
            SELECT CHANNEL
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {["text", "file", "url"].map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  setChannel(ch);
                  setMessage("");
                  setUrl("");
                  setFileName("");
                  setResult(null);
                }}
                style={{
                  padding: "7px 18px",
                  borderRadius: "8px",
                  border: `1.5px solid ${channel === ch ? "var(--accent, #6366f1)" : "var(--border)"}`,
                  background: channel === ch ? "var(--accent-light, #eef2ff)" : "var(--bg2)",
                  color: channel === ch ? "var(--accent, #6366f1)" : "var(--text2)",
                  fontWeight: channel === ch ? "600" : "400",
                  fontSize: "13px",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {ch === "text" && "✏️ "}
                {ch === "file" && "📁 "}
                {ch === "url" && "🔗 "}
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Text input */}
        {channel === "text" && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--text3)",
                }}
              >
                MESSAGE BODY
              </label>
              {message && (
                <button
                  onClick={() => { setMessage(""); setResult(null); }}
                  style={{
                    fontSize: "11px",
                    color: "var(--text3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); setResult(null); }}
              placeholder="Paste the message text here..."
              rows={5}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--text1)",
                fontSize: "13px",
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: "1.6",
              }}
            />
            <div
              style={{
                fontSize: "11px",
                color: "var(--text3)",
                marginTop: "4px",
                textAlign: "right",
              }}
            >
              {message.length} characters
            </div>
          </div>
        )}

        {/* File input */}
        {channel === "file" && (
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text3)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              UPLOAD FILE
            </label>
            <label
              style={{
                display: "block",
                border: "2px dashed var(--border)",
                borderRadius: "10px",
                padding: "28px",
                textAlign: "center",
                cursor: "pointer",
                background: "var(--bg2)",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>📂</div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text1)",
                  marginBottom: "4px",
                }}
              >
                {fileName || "Click to upload"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)" }}>
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
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg2)",
                  color: "var(--text2)",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  resize: "vertical",
                }}
              />
            )}
          </div>
        )}

        {/* URL input */}
        {channel === "url" && (
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text3)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              ENTER URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setResult(null); }}
              placeholder="https://suspicious-site.com"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--text1)",
                fontSize: "13px",
              }}
            />
            <div
              style={{
                fontSize: "11px",
                color: "var(--text3)",
                marginTop: "6px",
              }}
            >
              Checks domain age, blacklist, and redirect chains
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#FCEBEB",
              color: "#A32D2D",
              fontSize: "12px",
              marginBottom: "16px",
              border: "1px solid #E24B4A44",
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
            padding: "13px",
            borderRadius: "10px",
            border: "none",
            background: canAnalyse && !loading ? "var(--accent, #6366f1)" : "var(--bg3, #ccc)",
            color: canAnalyse && !loading ? "#fff" : "var(--text3)",
            fontSize: "14px",
            fontWeight: "600",
            cursor: canAnalyse && !loading ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #ffffff44",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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