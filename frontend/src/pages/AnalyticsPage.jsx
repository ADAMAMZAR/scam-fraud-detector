import { useState, useEffect } from "react";

/**
 * AnalyticsPage - Analytics and statistics
 */
export function AnalyticsPage() {
  const [stats, setStats] = useState({ total: 0, scams: 0, suspicious: 0, safe: 0, channels: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("http://localhost:8000/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-glow" style={{ background: "#EF4444" }} />
          <div className="stat-label">Total Scams</div>
          <div className="stat-value">{stats.scams}</div>
          <div className="stat-delta delta-dn">Real Data</div>
        </div>
        <div className="stat-card">
          <div className="stat-glow" style={{ background: "#F59E0B" }} />
          <div className="stat-label">Suspicious</div>
          <div className="stat-value">{stats.suspicious}</div>
          <div className="stat-delta delta-up">Real Data</div>
        </div>
        <div className="stat-card">
          <div className="stat-glow" style={{ background: "#22C55E" }} />
          <div className="stat-label">Safe Messages</div>
          <div className="stat-value">{stats.safe}</div>
          <div className="stat-delta delta-up">Real Data</div>
        </div>
        <div className="stat-card">
          <div className="stat-glow" style={{ background: "#6366F1" }} />
          <div className="stat-label">Total Analysed</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-delta delta-up">Real Data</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Simple Table showing channel distribution (Real Data) */}
        <div className="card">
          <div className="card-title">Channel Breakdown</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th style={{ textAlign: "right" }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {stats.channels.map((ch) => (
                <tr key={ch.name}>
                  <td>{ch.name}</td>
                  <td style={{ textAlign: "right", fontWeight: "600" }}>{ch.value}</td>
                </tr>
              ))}
              {stats.channels.length === 0 && (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center", color: "var(--text3)", padding: "10px" }}>No data yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
