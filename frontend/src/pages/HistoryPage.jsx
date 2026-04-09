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
    <div className="full-width" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "16px", height: "calc(100vh - 120px)" }}>
      {/* Message List */}
      <div className="card" style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
        <div className="card-title">Scan History</div>
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text3)" }}>Loading history...</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text3)" }}>No history found in database.</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg-row ${selectedMsg?.id === msg.id ? "selected" : ""}`}
              onClick={() => setSelectedMsg(msg)}
            >
              <div className="channel-chip">{CHANNEL_ICONS[msg.channel] || "💬"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="msg-sender">{msg.sender}</div>
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

      {/* Detail Panel */}
      <MessageDetail msg={selectedMsg} onAnalyze={() => {}} />
    </div>
  );
}
