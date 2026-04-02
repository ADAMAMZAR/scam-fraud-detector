import { useState } from "react";
import { MOCK_MESSAGES } from "../data/mockData";
import { CHANNEL_ICONS } from "../constants/config";
import { VerdictBadge } from "../components/VerdictBadge";
import { ScoreBar } from "../components/ScoreBar";
import { fmtTime } from "../utils/formatters";

/**
 * MessagesPage - Display and filter messages
 */
export function MessagesPage() {
  const [selectedMsg, setSelectedMsg] = useState(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "16px", height: "100%" }}>
      {/* Message List */}
      <div className="card" style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
        <div className="card-title">Recent Messages</div>
        {MOCK_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`msg-row ${selectedMsg?.id === msg.id ? "selected" : ""}`}
            onClick={() => setSelectedMsg(msg)}
          >
            <div className="channel-chip">{CHANNEL_ICONS[msg.channel]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="msg-sender">{msg.sender}</div>
              <div className="msg-preview">{msg.body}</div>
            </div>
            <div className="msg-meta">
              <div className="msg-time">{fmtTime(msg.received_at)}</div>
              <VerdictBadge verdict={msg.verdict} />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedMsg ? (
        <div className="card" style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>Message Details</h3>
            <button
              onClick={() => setSelectedMsg(null)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text3)",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>
          {/* Message detail content will be rendered here */}
        </div>
      ) : null}
    </div>
  );
}
