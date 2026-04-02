/**
 * BatchPage - Batch analysis of multiple messages
 */
export function BatchPage() {
  return (
    <div className="card">
      <h2 style={{ marginBottom: "24px" }}>Batch Scan</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "600", color: "var(--text3)" }}>
          IMPORT MESSAGES
        </label>
        <div
          style={{
            border: "2px dashed var(--border2)",
            borderRadius: "10px",
            padding: "40px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border2)")}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📤</div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>
            Drop CSV file here
          </div>
          <div style={{ fontSize: "11px", color: "var(--text3)" }}>
            or click to browse
          </div>
        </div>
      </div>

      <button className="analyse-btn">Start Batch Analysis</button>
    </div>
  );
}
