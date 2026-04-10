import { useState, useEffect } from "react";
import { CHANNEL_ICONS } from "../constants/config";
import { VerdictBadge } from "../components/VerdictBadge";
import { fmtTime } from "../utils/formatters";
import { MessageDetail } from "../components/MessageDetail";

/**
 * HistoryPage - Display and filter scan history
 */
export function HistoryPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("http://localhost:8000/history");
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="history-container" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "20px", minHeight: "calc(100vh - 160px)" }}>
      {/* Message List */}
      <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "16px" }}>Scan History</div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text3)" }}>Loading history...</div>
          ) : messages.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text3)" }}>No recorded scans found.</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`msg-row ${selectedMsg?.id === msg.id ? "selected" : ""}`}
                onClick={() => setSelectedMsg(msg)}
              >
                <div className="channel-chip">{CHANNEL_ICONS[msg.channel] || "💬"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="msg-sender">{msg.sender || "Unknown Sender"}</div>
                  <div className="msg-preview">{msg.message_body}</div>
                </div>
                <div className="msg-meta">
                  <div className="msg-time">{fmtTime(msg.created_at)}</div>
                  <VerdictBadge verdict={msg.verdict} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <MessageDetail msg={selectedMsg} onAnalyze={() => {}} />
      </div>
    </div>
  );
}
