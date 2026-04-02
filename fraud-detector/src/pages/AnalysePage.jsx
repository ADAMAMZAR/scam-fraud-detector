/**
 * AnalysePage - Analyze individual messages
 */
export function AnalysePage() {
  return (
    <div className="card">
      <h2 style={{ marginBottom: "24px" }}>Analyse Message</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "600", color: "var(--text3)" }}>
          SELECT CHANNEL
        </label>
        <div className="channel-select-row">
          {["email", "sms", "whatsapp"].map((channel) => (
            <button
              key={channel}
              className="channel-opt active"
              style={{ textTransform: "capitalize" }}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "600", color: "var(--text3)" }}>
          MESSAGE BODY
        </label>
        <textarea
          className="analyse-textarea"
          placeholder="Paste the message text here..."
        />
      </div>

      <button className="analyse-btn">Analyse Message</button>
    </div>
  );
}
