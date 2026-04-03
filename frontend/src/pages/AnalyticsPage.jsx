import { TREND_DATA, TACTIC_FREQ, CHANNEL_DATA } from "../data/mockData";


/**
 * AnalyticsPage - Analytics and statistics
 */
export function AnalyticsPage() {
  const totalMessages = TREND_DATA.reduce((sum, d) => sum + d.scam + d.suspicious + d.safe, 0);
  const totalScams = TREND_DATA.reduce((sum, d) => sum + d.scam, 0);
  const totalSuspicious = TREND_DATA.reduce((sum, d) => sum + d.suspicious, 0);
  const totalSafe = TREND_DATA.reduce((sum, d) => sum + d.safe, 0);

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-glow" style={{ background: "#EF4444" }} />
          <div className="stat-label">Total Scams</div>
          <div className="stat-value">{totalScams}</div>
          <div className="stat-delta delta-dn">↓ 2.5%</div>
        </div>
        <div className="stat-card">
          <div className="stat-glow" style={{ background: "#F59E0B" }} />
          <div className="stat-label">Suspicious</div>
          <div className="stat-value">{totalSuspicious}</div>
          <div className="stat-delta delta-up">↑ 1.2%</div>
        </div>
        <div className="stat-card">
          <div className="stat-glow" style={{ background: "#22C55E" }} />
          <div className="stat-label">Safe Messages</div>
          <div className="stat-value">{totalSafe}</div>
          <div className="stat-delta delta-up">↑ 3.8%</div>
        </div>
        <div className="stat-card">
          <div className="stat-glow" style={{ background: "#6366F1" }} />
          <div className="stat-label">Total Analysed</div>
          <div className="stat-value">{totalMessages}</div>
          <div className="stat-delta delta-up">↑ 0.5%</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Trend Chart */}
        <div className="card">
          <div className="card-title">Message Trend (7 Days)</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Scams</th>
                <th style={{ textAlign: "right" }}>Suspicious</th>
                <th style={{ textAlign: "right" }}>Safe</th>
              </tr>
            </thead>
            <tbody>
              {TREND_DATA.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td style={{ textAlign: "right", color: "#EF4444", fontWeight: "600" }}>{row.scam}</td>
                  <td style={{ textAlign: "right", color: "#F59E0B", fontWeight: "600" }}>{row.suspicious}</td>
                  <td style={{ textAlign: "right", color: "#22C55E", fontWeight: "600" }}>{row.safe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tactic Frequency */}
        <div className="card">
          <div className="card-title">Most Common Tactics</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tactic</th>
                <th style={{ textAlign: "right" }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {TACTIC_FREQ.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td style={{ textAlign: "right", fontWeight: "600" }}>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Distribution */}
      <div className="card" style={{ marginTop: "16px" }}>
        <div className="card-title">Channel Distribution</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {CHANNEL_DATA.map((channel) => (
            <div key={channel.name} style={{ padding: "12px", background: "var(--surface2)", borderRadius: "8px" }}>
              <div style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "6px" }}>
                {channel.name}
              </div>
              <div style={{ fontSize: "24px", fontWeight: "800", fontFamily: "var(--font-display)" }}>
                {channel.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
