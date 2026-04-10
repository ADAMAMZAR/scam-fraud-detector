import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Constants ────────────────────────────────────────────────────────────────
const RANGES = [
  { key: "1d",  label: "Today"   },
  { key: "7d",  label: "7 Days"  },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
];

const LINE_COLORS = {
  scam:       "#EF4444",
  suspicious: "#F59E0B",
  safe:       "#22C55E",
};

const PIE_COLORS = [
  "var(--primary)",
  "var(--indigo-dark)",
  "var(--indigo-light)",
  "var(--slate-dark)",
  "var(--primary-light)",
  "var(--slate-light)"
];

const TACTIC_COLORS = {
  URGENCY_THREAT:         "#EF4444",
  AUTHORITY_IMPERSONATION:"#8B5CF6",
  FEAR_APPEAL:            "#DC2626",
  REWARD_LURE:            "#F59E0B",
  ARTIFICIAL_SCARCITY:    "#F97316",
  PERSONAL_DATA_REQUEST:  "#06B6D4",
  LEGAL_THREAT:           "#EF4444",
  ACCOUNT_DEACTIVATION:   "#EC4899",
  ISOLATION_TACTIC:       "#64748B",
  SOCIAL_PROOF:           "#3B82F6",
  PRIZE_LURE:             "#F59E0B",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtTactic(t) {
  return t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-MY", { day: "2-digit", month: "short" });
}

// ── Custom tooltip for line chart ────────────────────────────────────────────
function TrendTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: "var(--surface)", borderRadius: "10px", padding: "12px 16px",
      boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
    }}>
      <div style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "600", marginBottom: "6px" }}>
        {fmtDate(label)}
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ fontSize: "12px", color: "var(--text)", fontWeight: "600" }}>
            {p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function AnalyticsPage() {
  const [range, setRange]     = useState("7d");
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({ total: 0, scams: 0, suspicious: 0, safe: 0 });

  // Fetch original /stats for the 4 summary cards
  useEffect(() => {
    fetch("http://localhost:8000/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  // Fetch /analytics/summary for charts
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/analytics/summary?time_range=${range}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { console.error(e); setLoading(false); });
  }, [range]);

  return (
    <div>
      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="stats-grid">
        {[
          { label: "Total Scams",    value: stats.scams,      color: "var(--red)",   icon: "🚨" },
          { label: "Suspicious",     value: stats.suspicious, color: "var(--amber)", icon: "⚠️" },
          { label: "Safe Messages",  value: stats.safe,       color: "var(--green)", icon: "✅" },
          { label: "Total Analysed", value: stats.total,      color: "var(--primary)", icon: "📊" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ 
                width: "40px", height: "40px", borderRadius: "10px", 
                background: "var(--bg-hover)", display: "flex", 
                alignItems: "center", justifyCenter: "center", fontSize: "20px" 
              }}>{s.icon}</div>
              <div className="stat-label">{s.label}</div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-delta" style={{ color: "var(--text3)" }}>Scanned via AI</div>
          </div>
        ))}
      </div>

      {/* ── Anomaly banner ──────────────────────────────────────────────── */}
      {data?.anomaly?.detected && (
        <div style={{
          background: "linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%)",
          border: "1.5px solid #FECACA",
          borderRadius: "12px",
          padding: "14px 18px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          animation: "resultIn 0.4s ease",
        }}>
          <span style={{ fontSize: "22px" }}>⚠️</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#991B1B" }}>
              Anomaly Detected — Scam rate is {data.anomaly.ratio}× higher than your 7-day average
            </div>
            <div style={{ fontSize: "12px", color: "#92400E", marginTop: "2px" }}>
              Today: {Math.round(data.anomaly.today_rate * 100)}% · 7-day avg: {Math.round(data.anomaly.avg_7d_rate * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* ── Date range picker ───────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap",
      }}>
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              border: "1.5px solid",
              borderColor: range === r.key ? "var(--primary)" : "var(--border)",
              background: range === r.key ? "var(--primary-dim)" : "var(--surface)",
              color: range === r.key ? "var(--primary)" : "var(--text2)",
              fontWeight: range === r.key ? "700" : "500",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
          <div style={{
            width: 28, height: 28, border: "3px solid #E5E7EB", borderTop: "3px solid #6366F1",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }} />
          Loading analytics...
        </div>
      )}

      {!loading && data && (
        <>
          {/* ── Charts grid ─────────────────────────────────────────────── */}
          <div className="grid-2" style={{ marginBottom: "20px" }}>
            {/* Line chart — Scam Volume Trend */}
            <div className="card" style={{ padding: "20px" }}>
              <div style={{
                fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em",
                color: "#6B7280", marginBottom: "16px",
              }}>
                📈 SCAN VOLUME TREND
              </div>
              {data.trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={data.trend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis
                      dataKey="date" tickFormatter={fmtDate}
                      tick={{ fontSize: 10, fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      allowDecimals={false}
                    />
                    <ReTooltip content={<TrendTooltip />} />
                    <Line type="monotone" dataKey="scam" stroke={LINE_COLORS.scam}
                      strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="suspicious" stroke={LINE_COLORS.suspicious}
                      strokeWidth={2} dot={{ r: 2.5 }} />
                    <Line type="monotone" dataKey="safe" stroke={LINE_COLORS.safe}
                      strokeWidth={2} dot={{ r: 2.5 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
                  No data in this range
                </div>
              )}
              {/* Line legend */}
              <div style={{ display: "flex", gap: "16px", marginTop: "10px", justifyContent: "center" }}>
                {Object.entries(LINE_COLORS).map(([key, color]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: 10, height: 3, borderRadius: 2, background: color }} />
                    <span style={{ fontSize: "11px", color: "#6B7280", fontWeight: "500", textTransform: "capitalize" }}>
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut chart — Channel Distribution */}
            <div className="card" style={{ padding: "20px" }}>
              <div style={{
                fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em",
                color: "#6B7280", marginBottom: "16px",
              }}>
                🍩 CHANNEL DISTRIBUTION
              </div>
              {data.channels.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={data.channels}
                      dataKey="count"
                      nameKey="channel"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      strokeWidth={0}
                    >
                      {data.channels.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={{
                        background: "#1E293B", border: "none", borderRadius: "8px",
                        fontSize: "12px", color: "#E2E8F0",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      formatter={(v) => <span style={{ fontSize: "11px", color: "#6B7280" }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
                  No channel data
                </div>
              )}
              {/* Total in center (overlay) */}
              {data.channels.length > 0 && (
                <div style={{
                  position: "relative", marginTop: "-165px", textAlign: "center",
                  pointerEvents: "none", marginBottom: "120px",
                }}>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--primary)" }}>
                    {data.total}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text3)", fontWeight: "700" }}>
                    TOTAL
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bar chart — Tactic Frequency (full width) */}
          <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
            <div style={{
              fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em",
              color: "#6B7280", marginBottom: "16px",
            }}>
              🎯 TOP MANIPULATION TACTICS
            </div>
            {data.tactics.length > 0 ? (
              <ResponsiveContainer width="100%" height={Math.max(180, data.tactics.length * 42)}>
                <BarChart
                  data={data.tactics}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="tactic"
                    width={150}
                    tick={{ fontSize: 11, fill: "#4B5563", fontWeight: 500 }}
                    tickFormatter={fmtTactic}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ReTooltip
                    contentStyle={{
                      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px",
                      fontSize: "12px", color: "var(--text)",
                      boxShadow: "var(--shadow-lg)",
                    }}
                    formatter={(v, name) => [`${v} occurrences`, fmtTactic(name)]}
                    labelFormatter={fmtTactic}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {data.tactics.map((t, i) => (
                      <Cell
                        key={i}
                        fill={TACTIC_COLORS[t.tactic] || PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: 120, display: "flex", alignItems: "center", justifyContent: "center",
                color: "#9CA3AF", fontSize: "13px",
              }}>
                No tactic data yet — analyse some messages first
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes resultIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
