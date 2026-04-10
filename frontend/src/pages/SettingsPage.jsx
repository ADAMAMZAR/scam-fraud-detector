import { useState, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  darkMode: true,
  apiUrl: "http://localhost:8000",
  apiKey: "",
  safeThreshold: 40,
  fraudThreshold: 75,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadSettings() {
  try {
    const saved = localStorage.getItem("appSettings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem("scanHistory") || "[]");
  } catch {
    return [];
  }
}

// ─── Small components ─────────────────────────────────────────────────────────

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        border: "none",
        background: on ? "#6366f1" : "var(--border, #d1d5db)",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "4px",
          left: on ? "24px" : "4px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "var(--shadow-sm)",
        }}
      />
    </button>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "8px",
        }}
      >
        {icon && <span style={{ fontSize: "13px" }}>{icon}</span>}
        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.07em",
            color: "var(--text3, #6b7280)",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, desc, children, last }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 20px",
        borderBottom: last ? "none" : "1px solid var(--border)",
      }}
    >
      {icon && (
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--bg-hover)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            flexShrink: 0,
            color: "var(--primary)",
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--text)",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        {desc && (
          <div
            style={{
              fontSize: "12px",
              color: "var(--text3)",
              lineHeight: 1.5,
            }}
          >
            {desc}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        textAlign: "center",
        padding: "16px 12px",
        borderRadius: "12px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontSize: "26px",
          fontWeight: "800",
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "var(--text3)",
          marginTop: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (!status) return null;
  const map = {
    testing: { bg: "#fef9c3", color: "#854d0e", text: "Testing..." },
    success: { bg: "#dcfce7", color: "#166534", text: "✓ Connected" },
    error:   { bg: "#fee2e2", color: "#991b1b", text: "✗ Unreachable" },
  };
  const s = map[status];
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: "600",
        padding: "3px 10px",
        borderRadius: "20px",
        background: s.bg,
        color: s.color,
        transition: "all 0.2s",
      }}
    >
      {s.text}
    </span>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        padding: "12px 18px",
        borderRadius: "10px",
        background: type === "error" ? "#fee2e2" : "#dcfce7",
        color: type === "error" ? "#991b1b" : "#166534",
        border: `1px solid ${type === "error" ? "#fca5a5" : "#86efac"}`,
        fontSize: "13px",
        fontWeight: "500",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        zIndex: 9999,
        maxWidth: "300px",
        animation: "toastIn 0.25s ease",
      }}
    >
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {message}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SettingsPage({ globalDarkMode, setGlobalDarkMode }) {
  const [settings, setSettings]     = useState(loadSettings);
  const [apiKeyInput, setApiKeyInput] = useState(() => loadSettings().apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiStatus, setApiStatus]   = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast]           = useState({ message: "", type: "success" });
  const [history, setHistory]       = useState(loadHistory);
  const [copied, setCopied]         = useState("");   // "url" | "key" | ""
  const [backendStats, setBackendStats] = useState({ total: 0, scams: 0, suspicious: 0, safe: 0 });

  // Load settings from backend on mount
  useEffect(() => {
    async function loadFromDB() {
      try {
        const config = loadSettings();
        // 1. Load Thresholds
        const res = await fetch(`${config.apiUrl}/settings`);
        if (res.ok) {
          const data = await res.json();
          const merged = {
            ...config,
            safeThreshold: data.safe_threshold ?? 40,
            fraudThreshold: data.fraud_threshold ?? 75,
          };
          setSettings(merged);
          localStorage.setItem("appSettings", JSON.stringify({ ...merged, darkMode: globalDarkMode }));
        }

        // 2. Load Stats
        const statsRes = await fetch(`${config.apiUrl}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setBackendStats(statsData);
        }
      } catch { /* offline — use localStorage */ }
    }
    loadFromDB();
  }, []);

  // Derived stats (fallback to backend if loaded, otherwise use local history)
  const stats = {
    total:      backendStats.total || history.length,
    fraud:      backendStats.scams || history.filter((h) => h.label === "Fraud").length,
    suspicious: backendStats.suspicious || history.filter((h) => h.label === "Suspicious").length,
    safe:       backendStats.safe || history.filter((h) => h.label === "Safe").length,
  };

  // Theme sync to backend (was previously here, now just does the patching)
  const toggleTheme = () => {
    const newVal = !globalDarkMode;
    setGlobalDarkMode(newVal);
    // Sync to backend (fire-and-forget)
    fetch(`${settings.apiUrl}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dark_mode: newVal }),
    }).catch(() => {});
    
    // Update localStorage
    localStorage.setItem("appSettings", JSON.stringify({ ...settings, darkMode: newVal }));
  };

  // Toast helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  }, []);

  // Update one setting key
  function set(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }

  // Save everything to localStorage AND backend
  async function handleSave() {
    try {
      const final = { ...settings, apiKey: apiKeyInput };
      localStorage.setItem("appSettings", JSON.stringify(final));
      setSettings(final);
      // Sync thresholds to backend
      await fetch(`${final.apiUrl}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dark_mode: globalDarkMode,
          safe_threshold: final.safeThreshold,
          fraud_threshold: final.fraudThreshold,
        }),
      });
      setHasChanges(false);
      showToast("✓ Settings saved");
    } catch {
      showToast("Failed to save settings", "error");
    }
  }

  // Real API health check — hits GET /health on your FastAPI
  async function testConnection() {
    setApiStatus("testing");
    try {
      const res = await fetch(`${settings.apiUrl}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        setApiStatus("success");
        showToast("✓ API connected successfully");
      } else {
        setApiStatus("error");
        showToast(`API returned ${res.status}`, "error");
      }
    } catch (err) {
      setApiStatus("error");
      showToast("Cannot reach API — is FastAPI running?", "error");
    }
  }

  // Copy to clipboard
  async function copy(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
      showToast(`✓ ${key === "url" ? "URL" : "API key"} copied`);
    } catch {
      showToast("Copy failed", "error");
    }
  }

  // Export scan history as CSV download
  async function exportCSV() {
    try {
      const response = await fetch(`${settings.apiUrl}/history?limit=1000`);
      if (!response.ok) throw new Error("Failed to fetch history for export");
      
      const data = await response.json();
      if (!data.length) {
        showToast("No scan history to export", "error");
        return;
      }
      
      const headers = ["id", "created_at", "channel", "message_body", "score", "verdict"];
      const rows = data.map((h) =>
        headers
          .map((k) => `"${String(h[k] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      );
      const csv  = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `scans-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`✓ Exported ${data.length} records`);
    } catch (err) {
      showToast("Export failed", "error");
    }
  }

  const { safeThreshold: ST, fraudThreshold: FT } = settings;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: "48px" }}>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 3px" }}>Settings</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text3)" }}>
            Configure your AI detection parameters
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          style={{
            padding: "10px 24px",
            borderRadius: "10px",
            border: "none",
            background: hasChanges ? "var(--primary)" : "var(--bg-hover)",
            color: hasChanges ? "#fff" : "var(--text3)",
            fontSize: "14px",
            fontWeight: "700",
            cursor: hasChanges ? "pointer" : "default",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            boxShadow: hasChanges ? "var(--shadow)" : "none",
          }}
        >
          {hasChanges ? "Save Changes" : "Everything Saved"}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          1. SCAN SUMMARY
      ══════════════════════════════════════════════════════════════════════ */}
      <Section title="Scan Summary" icon="📊">
        {/* Stats row */}
        <div style={{ padding: "14px 16px", borderBottom: "0.5px solid var(--border, #e5e7eb)" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatCard label="Total"      value={stats.total}      color="var(--text1, #111827)" />
            <StatCard label="Fraud"      value={stats.fraud}      color="#dc2626" />
            <StatCard label="Suspicious" value={stats.suspicious} color="#d97706" />
            <StatCard label="Safe"       value={stats.safe}       color="#16a34a" />
          </div>
        </div>

        {/* Export button */}
        <Row icon="📥" label="Export History" desc="Download all scan records as a CSV file" last>
          <button
            onClick={exportCSV}
            disabled={stats.total === 0}
            className="topbar-btn primary"
            style={{
              padding: "7px 16px",
              fontSize: "12px",
              opacity: stats.total === 0 ? 0.6 : 1,
            }}
          >
            Export CSV
          </button>
        </Row>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. BACKEND API
      ══════════════════════════════════════════════════════════════════════ */}
      

      {/* ══════════════════════════════════════════════════════════════════════
          3. RISK THRESHOLDS
      ══════════════════════════════════════════════════════════════════════ */}
      <Section title="Risk Score Thresholds" icon="🎚️">

        {/* Suspicious slider */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "0.5px solid var(--border, #e5e7eb)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--text1, #111827)",
                }}
              >
                Suspicious threshold
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text3, #9ca3af)",
                  marginTop: "2px",
                }}
              >
                Scores above this show a warning
              </div>
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "var(--amber)",
                lineHeight: 1,
              }}
            >
              {ST}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={FT - 5}
            value={ST}
            onChange={(e) => set("safeThreshold", parseInt(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--amber)",
              cursor: "pointer",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "3px",
            }}
          >
            <span style={{ fontSize: "10px", color: "var(--text3, #9ca3af)" }}>10</span>
            <span style={{ fontSize: "10px", color: "var(--text3, #9ca3af)" }}>{FT - 5}</span>
          </div>
        </div>

        {/* Fraud slider */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "0.5px solid var(--border, #e5e7eb)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--text1, #111827)",
                }}
              >
                Fraud threshold
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text3, #9ca3af)",
                  marginTop: "2px",
                }}
              >
                Scores above this are flagged as fraud
              </div>
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "var(--red)",
                lineHeight: 1,
              }}
            >
              {FT}
            </span>
          </div>
          <input
            type="range"
            min={ST + 5}
            max={95}
            value={FT}
            onChange={(e) => set("fraudThreshold", parseInt(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--red)",
              cursor: "pointer",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "3px",
            }}
          >
            <span style={{ fontSize: "10px", color: "var(--text3, #9ca3af)" }}>{ST + 5}</span>
            <span style={{ fontSize: "10px", color: "var(--text3, #9ca3af)" }}>95</span>
          </div>
        </div>

        {/* Live preview bar */}
        <div
          style={{
            padding: "14px 16px",
            background: "var(--bg2, #f9fafb)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "var(--text3, #9ca3af)",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Live preview
          </div>
          {/* Colour bar */}
          <div
            style={{
              display: "flex",
              height: "10px",
              borderRadius: "5px",
              overflow: "hidden",
              gap: "2px",
            }}
          >
            <div
              style={{
                flex: ST,
                background: "var(--green)",
                borderRadius: "5px 0 0 5px",
                transition: "flex 0.2s",
              }}
            />
            <div
              style={{
                flex: FT - ST,
                background: "var(--amber)",
                transition: "flex 0.2s",
              }}
            />
            <div
              style={{
                flex: 100 - FT,
                background: "var(--red)",
                borderRadius: "0 5px 5px 0",
                transition: "flex 0.2s",
              }}
            />
          </div>
          {/* Zone labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            {[
              { label: "Safe",       range: `0–${ST}`,       color: "var(--green)" },
              { label: "Suspicious", range: `${ST}–${FT}`,   color: "var(--amber)" },
              { label: "Fraud",      range: `${FT}–100`,     color: "var(--red)" },
            ].map((z) => (
              <div
                key={z.label}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    background: z.color,
                  }}
                />
                <span style={{ fontSize: "10px", color: "var(--text3, #9ca3af)" }}>
                  {z.label} ({z.range})
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. APPEARANCE
      ══════════════════════════════════════════════════════════════════════ */}
      <Section title="Appearance" icon="🎨">
        <Row
          icon="🌙"
          label="Dark Mode"
          desc="Switch between dark and light theme"
          last
        >
          <Toggle
            on={globalDarkMode}
            onToggle={toggleTheme}
          />
        </Row>
      </Section>

      {/* ── Footer ── */}
      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "var(--text3, #9ca3af)",
          margin: 0,
        }}
      >
        Scam Detector v1.0.0 · All data stored locally on your device
      </p>

      {/* ── Toast ── */}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}