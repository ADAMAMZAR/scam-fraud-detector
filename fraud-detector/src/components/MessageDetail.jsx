import { VERDICT_CONFIG, CHANNEL_ICONS, TACTIC_META } from "../constants/config";
import { fmtTime } from "../utils/formatters";
import { VerdictBadge } from "./VerdictBadge";
import { ScoreBar } from "./ScoreBar";
import { HeatSentence } from "./HeatSentence";

/**
 * MessageDetail - Detailed view of a single message
 */
export function MessageDetail({ msg }) {
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
            {fmtTime(msg.received_at)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <VerdictBadge verdict={msg.verdict} />
          <span style={{ fontSize: "24px", fontWeight: "800", fontFamily: "var(--font-display)" }}>
            {(msg.scam_score * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Score Bar */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "8px", fontWeight: "600" }}>
          SCAM SCORE
        </div>
        <ScoreBar score={msg.scam_score} verdict={msg.verdict} />
      </div>

      {/* Message Body */}
      <div style={{ marginBottom: "24px", padding: "14px", background: "var(--surface2)", borderRadius: "10px" }}>
        <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "8px", fontWeight: "600" }}>
          MESSAGE
        </div>
        <div style={{ fontSize: "13px", lineHeight: "1.8", color: "var(--text)" }}>
          {msg.body}
        </div>
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
