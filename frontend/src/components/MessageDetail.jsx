import { useState, useEffect } from "react";
import { VERDICT_CONFIG, CHANNEL_ICONS, TACTIC_META } from "../constants/config";
import { fmtTime } from "../utils/formatters";
import { VerdictBadge } from "./VerdictBadge";
import { ScoreBar } from "./ScoreBar";
import { HeatSentence } from "./HeatSentence";

/**
 * MessageDetail - Detailed view of a single message
 */
export function MessageDetail({ msg }) {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  // Reset AI result when message changes
  useEffect(() => {
    setAiResult(null);
    setError("");
  }, [msg?.id]);

  async function handleAIAnalysis() {
    if (!msg) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg.message_body || msg.body,
          channel: msg.channel || "text",
          sender: msg.sender,
        }),
      });
      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setAiResult(data);
    } catch (err) {
      setError("AI Analysis failed. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!msg) {
    return (
      <div className="card" style={{ height: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">Select a message to view details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ minHeight: "600px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "16px" }}>{CHANNEL_ICONS[msg.channel] || "💬"}</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>
              {msg.sender}
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text3)" }}>
            {fmtTime(msg.created_at || msg.received_at)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          < VerdictBadge verdict={msg.verdict} />
          <span style={{ fontSize: "24px", fontWeight: "800", fontFamily: "var(--font-display)" }}>
            {((msg.scam_score ?? (msg.score > 1 ? msg.score / 100 : msg.score)) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Score Bar */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "8px", fontWeight: "600" }}>
          SCAM SCORE
        </div>
        <ScoreBar 
          score={msg.scam_score ?? (msg.score > 1 ? msg.score / 100 : msg.score)} 
          verdict={msg.verdict} 
        />
      </div>

      {/* Message Body */}
      <div style={{ marginBottom: "24px", padding: "14px", background: "var(--surface2)", borderRadius: "10px" }}>
        <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "8px", fontWeight: "600" }}>
          MESSAGE
        </div>
        <div style={{ fontSize: "13px", lineHeight: "1.8", color: "var(--text)" }}>
          {msg.message_body || msg.body}
        </div>
      </div>

      {/* AI Analysis Trigger / Results */}
      <div style={{ marginBottom: "24px" }}>
        {!aiResult && !loading && (
          <button
            onClick={handleAIAnalysis}
            className="topbar-btn primary"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: "700",
              gap: "8px",
            }}
          >
            ✨ Deep AI Analysis
          </button>
        )}

        {loading && (
          <div style={{ padding: "20px", textAlign: "center", background: "var(--surface2)", borderRadius: "10px" }}>
            <div className="spinner" style={{ borderTopColor: "var(--accent)", margin: "0 auto 10px" }}></div>
            <div style={{ fontSize: "13px", color: "var(--text2)" }}>Gemini is thinking...</div>
          </div>
        )}

        {error && (
          <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontSize: "12px" }}>
            ⚠️ {error}
          </div>
        )}

        {aiResult && (
          <div
            style={{
              padding: "16px",
              background: "var(--surface2)",
              borderRadius: "12px",
              border: "1px solid var(--accent)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent)" }}>AI VERDICT: {aiResult.verdict.toUpperCase()}</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text3)" }}>{aiResult.confidence}% confidence</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {aiResult.reasons.map((r, i) => (
                <div key={i} style={{ padding: "8px 12px", background: "var(--surface1)", borderRadius: "8px", borderLeft: "3px solid var(--accent)" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>{r.text}</div>
                  <div style={{ fontSize: "10px", color: "var(--text3)" }}>{r.category} • +{r.points}pts</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Heatmap */}
      {msg.heatmap && msg.heatmap.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "12px", fontWeight: "600" }}>
            TACTIC HEATMAP
          </div>
          <div style={{ padding: "14px", background: "var(--surface2)", borderRadius: "10px", lineHeight: "2.2" }}>
            {msg.heatmap.map((item, idx) => (
              <HeatSentence
                key={idx}
                 sentence={item.sentence}
                tactics={item.tactics}
                tactic={item.tactic}
                intensity={item.intensity}
                delay={idx * 30}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tactics */}
      {msg.tactics && msg.tactics.length > 0 && (
        <div>
          <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "12px", fontWeight: "600" }}>
            DETECTED TACTICS
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {msg.tactics.map((tactic) => {
              const meta = TACTIC_META[tactic];
              return (
                <div
                  key={tactic}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: meta.bg,
                    color: meta.color,
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {meta.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
