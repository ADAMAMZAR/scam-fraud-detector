import { useState, useRef, useEffect, useCallback } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API = "http://localhost:8000";

const VERDICT_STYLE = {
  FRAUD:      { bg: "#FFE4E6", color: "#9F1239", border: "#FCA5A5", emoji: "🚨" },
  SUSPICIOUS: { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D", emoji: "⚠️" },
  SAFE:       { bg: "#DCFCE7", color: "#166534", border: "#86EFAC", emoji: "✅" },
  ERROR:      { bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB", emoji: "❌" },
};

function verdictStyle(v) {
  return VERDICT_STYLE[v?.toUpperCase()] || VERDICT_STYLE.ERROR;
}

function newRow(id) {
  return { id, channel: "text", message: "", sender: "", url: "" };
}

let nextId = 1;

// Format elapsed seconds as "1m 23s" or "45s"
function fmtElapsed(seconds) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

// Format estimated time remaining
function fmtEta(completed, total, elapsedMs) {
  if (completed === 0) return null;
  const msPerItem = elapsedMs / completed;
  const remaining = Math.round(((total - completed) * msPerItem) / 1000);
  if (remaining < 5) return "almost done";
  if (remaining < 60) return `~${remaining}s`;
  return `~${Math.floor(remaining / 60)}m ${remaining % 60}s`;
}

// Download results as CSV
function downloadCsv(results, fileName) {
  const headers = ["#", "Message", "Channel", "Sender", "Verdict", "Score", "Confidence", "NLP", "URL", "Sender Score", "Reasons"];
  const rows = results.map((r) => [
    r.index + 1,
    `"${(r.message || "").replace(/"/g, '""')}"`,
    r.channel || "",
    r.sender || "",
    r.verdict || "",
    r.score ?? "",
    r.confidence ?? "",
    r.breakdown?.NLP ?? "",
    r.breakdown?.URL ?? "",
    r.breakdown?.Sender ?? "",
    `"${(r.reasons || []).map(x => x.text).join("; ").replace(/"/g, '""')}"`,
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "batch-results.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VerdictBadge({ verdict }) {
  const s = verdictStyle(verdict);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 10px", borderRadius: "20px", fontSize: "11px",
      fontWeight: "700", background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {s.emoji} {verdict}
    </span>
  );
}

function ScoreChip({ score, verdict }) {
  const s = verdictStyle(verdict);
  return (
    <span style={{
      fontFamily: "monospace", fontSize: "13px", fontWeight: "700",
      color: s.color, minWidth: "32px", textAlign: "right",
    }}>
      {score ?? "—"}
    </span>
  );
}

function ChannelPill({ channel }) {
  const map = { text: ["✏️", "#EEF2FF", "#4338CA"], email: ["📧", "#FFF7ED", "#C2410C"], url: ["🔗", "#F0FDF4", "#15803D"] };
  const [icon, bg, color] = map[channel] || ["❓", "#F3F4F6", "#4B5563"];
  return (
    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: bg, color, fontWeight: "600" }}>
      {icon} {channel}
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ completed, total, elapsedMs, onCancel }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const elapsedSec = Math.round(elapsedMs / 1000);
  const eta = fmtEta(completed, total, elapsedMs);

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text, #111827)" }}>
            Processing {total} {total === 1 ? "message" : "messages"}
          </span>
          <span style={{
            marginLeft: "10px", fontSize: "12px", color: "var(--cyan, #6366F1)",
            fontWeight: "600", fontFamily: "monospace",
          }}>
            {completed} / {total}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {eta && (
            <span style={{ fontSize: "12px", color: "var(--text3, #6B7280)" }}>
              ⏱ {eta} remaining
            </span>
          )}
          <span style={{ fontSize: "12px", color: "var(--text3, #9CA3AF)" }}>
            {fmtElapsed(elapsedSec)} elapsed
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div style={{
        height: "10px", borderRadius: "5px",
        background: "var(--border, #E5E7EB)", overflow: "hidden",
        marginBottom: "8px",
      }}>
        <div style={{
          height: "100%", borderRadius: "5px",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)",
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "0 0 8px rgba(99,102,241,0.4)",
        }} />
      </div>

      {/* Percentage + cancel */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--cyan, #6366F1)" }}>
          {pct}%
        </span>
        <button
          onClick={onCancel}
          style={{
            fontSize: "12px", padding: "6px 14px", borderRadius: "8px",
            border: "1.5px solid #EF4444", background: "transparent",
            color: "#EF4444", cursor: "pointer", fontWeight: "600",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          ✕ Cancel Job
        </button>
      </div>
    </div>
  );
}

// ─── Row Form ─────────────────────────────────────────────────────────────────

function ManualRow({ row, index, onChange, onRemove, totalRows }) {
  const CHANNELS = [
    { id: "text",  icon: "✏️", label: "Text" },
    { id: "email", icon: "📧", label: "Email" },
    { id: "url",   icon: "🔗", label: "URL" },
  ];

  return (
    <div style={{
      border: "1px solid var(--border, #E5E7EB)",
      borderRadius: "12px",
      padding: "16px",
      background: "var(--surface, #fff)",
      position: "relative",
      marginBottom: "12px",
      transition: "border-color 0.2s",
    }}>
      {/* Row number + remove */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text3, #6B7280)", letterSpacing: "0.06em" }}>
          ROW {index + 1}
        </span>
        {totalRows > 1 && (
          <button onClick={onRemove} style={{
            fontSize: "12px", color: "#EF4444", background: "none", border: "none",
            cursor: "pointer", fontWeight: "600", padding: "2px 6px",
          }}>✕ Remove</button>
        )}
      </div>

      {/* Channel selector */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onChange({ ...row, channel: ch.id, message: "", sender: "", url: "" })}
            style={{
              padding: "6px 14px", borderRadius: "7px", fontSize: "12px", cursor: "pointer",
              border: `1.5px solid ${row.channel === ch.id ? "#6366F1" : "var(--border, #E5E7EB)"}`,
              background: row.channel === ch.id ? "#EEF2FF" : "var(--bg2, #F9FAFB)",
              color: row.channel === ch.id ? "#4338CA" : "var(--text2, #374151)",
              fontWeight: row.channel === ch.id ? "700" : "400",
              transition: "all 0.15s",
            }}
          >{ch.icon} {ch.label}</button>
        ))}
      </div>

      {/* Dynamic fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {row.channel === "email" && (
          <input
            type="email"
            placeholder="Sender email e.g. support@suspicious.com"
            value={row.sender}
            onChange={(e) => onChange({ ...row, sender: e.target.value })}
            style={inputStyle}
          />
        )}

        {row.channel === "url" ? (
          <input
            type="url"
            placeholder="Paste URL e.g. https://phishing-site.xyz"
            value={row.url}
            onChange={(e) => onChange({ ...row, url: e.target.value })}
            style={inputStyle}
          />
        ) : (
          <textarea
            placeholder={row.channel === "email" ? "Email body..." : "Paste message here..."}
            value={row.message}
            onChange={(e) => onChange({ ...row, message: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
          />
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--bg-input)",
  color: "var(--text)",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "var(--font-ui)",
};

// ─── Result Row ───────────────────────────────────────────────────────────────

function ResultRow({ result, isExpanded, onToggle }) {
  const s = verdictStyle(result.verdict);
  return (
    <>
      <tr
        onClick={onToggle}
        style={{ cursor: "pointer", transition: "background 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover, #F9FAFB)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text3, #6B7280)", fontFamily: "monospace" }}>
          #{(result.index + 1).toString().padStart(2, "0")}
        </td>
        <td style={{ padding: "12px 8px" }}>
          <ChannelPill channel={result.channel} />
        </td>
        <td style={{ padding: "12px 8px", maxWidth: "280px" }}>
          <div style={{ fontSize: "13px", color: "var(--text, #111827)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {result.message || result.url || "(no preview)"}
          </div>
          {result.sender && (
            <div style={{ fontSize: "11px", color: "var(--text3, #9CA3AF)", marginTop: "2px" }}>from: {result.sender}</div>
          )}
        </td>
        <td style={{ padding: "12px 8px" }}>
          <VerdictBadge verdict={result.verdict} />
        </td>
        <td style={{ padding: "12px 16px", textAlign: "right" }}>
          <ScoreChip score={result.score} verdict={result.verdict} />
        </td>
        <td style={{ padding: "12px 16px", fontSize: "14px", color: "var(--text3, #9CA3AF)" }}>
          {isExpanded ? "▲" : "▼"}
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={6} style={{ padding: "0 16px 16px" }}>
            <div style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: "10px",
              padding: "14px 16px",
              fontSize: "13px",
            }}>
              {result.error ? (
                <div style={{ color: "#991B1B" }}>⚠️ Analysis failed: {result.error}</div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "24px", marginBottom: "10px" }}>
                    <div><span style={{ color: "var(--text3, #6B7280)", fontSize: "11px" }}>CONFIDENCE</span>
                      <div style={{ fontWeight: "700", color: s.color }}>{result.confidence}%</div></div>
                    <div><span style={{ color: "var(--text3, #6B7280)", fontSize: "11px" }}>NLP</span>
                      <div style={{ fontWeight: "700", color: s.color }}>{result.breakdown?.NLP ?? "—"}</div></div>
                    <div><span style={{ color: "var(--text3, #6B7280)", fontSize: "11px" }}>URL</span>
                      <div style={{ fontWeight: "700", color: s.color }}>{result.breakdown?.URL ?? "—"}</div></div>
                    <div><span style={{ color: "var(--text3, #6B7280)", fontSize: "11px" }}>SENDER</span>
                      <div style={{ fontWeight: "700", color: s.color }}>{result.breakdown?.Sender ?? "—"}</div></div>
                  </div>
                  {result.reasons?.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {result.reasons.map((r, i) => (
                        <div key={i} style={{ fontSize: "12px", color: s.color }}>
                          • <strong>{r.text}</strong> <span style={{ opacity: 0.7 }}>({r.category}, +{r.points}pts)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BatchPage() {
  const [mode, setMode] = useState("manual"); // "manual" | "file"

  // ── Manual mode state ──
  const [rows, setRows] = useState([newRow(nextId++)]);

  // ── File mode state ──
  const [file, setFile]               = useState(null);
  const [fileRows, setFileRows]       = useState([]);
  const [fileParsing, setFileParsing] = useState(false);
  const [fileError, setFileError]     = useState("");
  const [isDragging, setIsDragging]   = useState(false);
  const fileRef = useRef();

  // ── Async job state ──
  const [jobId, setJobId]           = useState(null);
  const [jobStatus, setJobStatus]   = useState(null); // null | "queued" | "processing" | "complete" | "failed" | "cancelled"
  const [jobProgress, setJobProgress] = useState({ completed: 0, total: 0 });
  const [results, setResults]       = useState(null);
  const [expanded, setExpanded]     = useState({});
  const [scanError, setScanError]   = useState("");
  const [startTime, setStartTime]   = useState(null);
  const [elapsedMs, setElapsedMs]   = useState(0);

  const pollRef = useRef(null);

  // ── Elapsed timer ──
  useEffect(() => {
    let timer;
    if (jobStatus === "processing" || jobStatus === "queued") {
      timer = setInterval(() => {
        setElapsedMs(Date.now() - startTime);
      }, 500);
    }
    return () => clearInterval(timer);
  }, [jobStatus, startTime]);

  // ── Poll job status ──
  const pollJob = useCallback(async (id) => {
    try {
      const res = await fetch(`${API}/v1/jobs/${id}`);
      if (!res.ok) throw new Error("Poll failed");
      const data = await res.json();

      setJobStatus(data.status);
      setJobProgress({ completed: data.completed, total: data.total });

      if (data.status === "complete" || data.status === "cancelled") {
        setResults(data.results || []);
        clearInterval(pollRef.current);
        pollRef.current = null;
      } else if (data.status === "failed") {
        setScanError("Batch job failed on the server.");
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    } catch (e) {
      console.error("Poll error:", e);
    }
  }, []);

  // ── Start polling when jobId is set ──
  useEffect(() => {
    if (!jobId) return;
    // Poll immediately, then every 2s
    pollJob(jobId);
    pollRef.current = setInterval(() => pollJob(jobId), 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId, pollJob]);

  // ── Manual row operations ──
  function addRow() {
    setRows((prev) => prev.length < 3 ? [...prev, newRow(nextId++)] : prev);
  }
  function updateRow(id, updated) {
    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }
  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  // ── File handling ──
  async function handleFilePick(picked) {
    if (!picked) return;
    setFile(picked);
    setFileRows([]);
    setFileError("");
    setResults(null);
    setFileParsing(true);
    try {
      const fd = new FormData();
      fd.append("file", picked);
      const res = await fetch(`${API}/parse-file`, { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Parsing failed");
      }
      const data = await res.json();
      setFileRows(data.rows || []);
    } catch (e) {
      setFileError(e.message);
    } finally {
      setFileParsing(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFilePick(e.dataTransfer.files[0]);
  }

  // ── Submit batch job ──
  async function runScan() {
    setScanError("");
    setResults(null);
    setJobId(null);
    setJobStatus(null);
    setJobProgress({ completed: 0, total: 0 });
    setExpanded({});

    let items;
    if (mode === "manual") {
      items = rows.map((r) => ({
        message: r.channel === "url" ? r.url : r.message,
        channel: r.channel,
        sender:  r.channel === "email" ? r.sender : undefined,
      }));
      const invalid = items.findIndex((it) => !it.message?.trim());
      if (invalid !== -1) {
        setScanError(`Row ${invalid + 1} is incomplete. Please fill in all required fields.`);
        return;
      }
    } else {
      items = fileRows.map((r) => ({ message: r.message, channel: r.channel, sender: r.sender }));
      if (!items.length) {
        setScanError("No rows to scan. Please upload and parse a file first.");
        return;
      }
    }

    try {
      const res = await fetch(`${API}/v1/analyse/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          file_name: file?.name || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to start batch job");
      }
      const data = await res.json();
      setJobId(data.job_id);
      setJobProgress({ completed: 0, total: data.total });
      setJobStatus("queued");
      setStartTime(Date.now());
      setElapsedMs(0);
    } catch (e) {
      setScanError(e.message);
    }
  }

  // ── Cancel job ──
  async function cancelJob() {
    if (!jobId) return;
    try {
      await fetch(`${API}/v1/jobs/${jobId}/cancel`, { method: "POST" });
      setJobStatus("cancelled");
      clearInterval(pollRef.current);
      pollRef.current = null;
    } catch (e) {
      console.error("Cancel failed:", e);
    }
  }

  // ── Reset ──
  function resetPage() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    setJobId(null);
    setJobStatus(null);
    setJobProgress({ completed: 0, total: 0 });
    setResults(null);
    setExpanded({});
    setScanError("");
    setElapsedMs(0);
    setStartTime(null);
  }

  // ── Derived ──
  const isRunning = jobStatus === "queued" || jobStatus === "processing";
  const isDone    = jobStatus === "complete" || jobStatus === "cancelled";
  const canScan   = !isRunning && (
    mode === "manual"
      ? rows.every((r) => r.channel === "url" ? r.url.trim() : r.message.trim())
      : fileRows.length > 0
  );
  const totalItems = mode === "manual" ? rows.length : fileRows.length;

  const summary = results && results.length > 0 ? {
    total:  results.length,
    fraud:  results.filter((r) => r.verdict?.toUpperCase() === "FRAUD").length,
    susp:   results.filter((r) => r.verdict?.toUpperCase() === "SUSPICIOUS").length,
    safe:   results.filter((r) => r.verdict?.toUpperCase() === "SAFE").length,
    errors: results.filter((r) => r.verdict?.toUpperCase() === "ERROR").length,
  } : null;

  const elapsedFinished = Math.round(elapsedMs / 1000);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", paddingBottom: "48px" }}>

      {/* ── Mode tabs ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "manual", icon: "✍️", label: "Manual Entry" },
          { id: "file",   icon: "📂", label: "File Import (CSV / PDF)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setMode(tab.id); resetPage(); }}
            style={{
              padding: "10px 22px", borderRadius: "10px", fontSize: "13px",
              fontWeight: mode === tab.id ? "700" : "500", cursor: "pointer",
              border: `1.5px solid ${mode === tab.id ? "var(--cyan, #6366F1)" : "var(--border, #E5E7EB)"}`,
              background: mode === tab.id ? "rgba(99,102,241,0.1)" : "var(--surface, #fff)",
              color: mode === tab.id ? "var(--cyan, #4338CA)" : "var(--text2, #374151)",
              transition: "all 0.2s",
            }}
          >{tab.icon} {tab.label}</button>
        ))}
      </div>

      {/* ══════════════════════════════
          MANUAL ENTRY MODE
      ══════════════════════════════ */}
      {mode === "manual" && !isRunning && !isDone && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "20px" }}>Manual Batch Entry</h2>

          {rows.map((row, index) => (
            <ManualRow
              key={row.id}
              row={row}
              index={index}
              totalRows={rows.length}
              onChange={(updated) => updateRow(row.id, updated)}
              onRemove={() => removeRow(row.id)}
            />
          ))}

          <button
            onClick={addRow}
            disabled={rows.length >= 3}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              border: `2px dashed ${rows.length >= 3 ? "var(--border, #E5E7EB)" : "var(--border2, #D1D5DB)"}`,
              background: "transparent",
              color: rows.length >= 3 ? "var(--text3, #C4C4C4)" : "var(--text3, #6B7280)",
              fontSize: "13px", fontWeight: "600",
              cursor: rows.length >= 3 ? "not-allowed" : "pointer",
              transition: "all 0.2s", marginBottom: "8px",
              opacity: rows.length >= 3 ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (rows.length < 3) { e.currentTarget.style.borderColor = "var(--cyan, #6366F1)"; e.currentTarget.style.color = "var(--cyan, #4338CA)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = rows.length >= 3 ? "var(--border, #E5E7EB)" : "var(--border2, #D1D5DB)"; e.currentTarget.style.color = rows.length >= 3 ? "var(--text3, #C4C4C4)" : "var(--text3, #6B7280)"; }}
          >
            {rows.length >= 3 ? "🔒 Max 3 rows reached" : "➕ Add Row"}
          </button>

          <div style={{ fontSize: "11px", color: "var(--text3, #9CA3AF)", marginBottom: "4px" }}>
            {rows.length} / 3 messages queued {rows.length >= 3 && "· limit reached to conserve AI tokens"}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          FILE IMPORT MODE
      ══════════════════════════════ */}
      {mode === "file" && !isRunning && !isDone && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "20px" }}>File Import</h2>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "var(--cyan, #6366F1)" : file ? "var(--cyan, #6366F1)" : "var(--border2, #D1D5DB)"}`,
              borderRadius: "14px",
              padding: "36px 20px",
              textAlign: "center",
              background: isDragging ? "rgba(99,102,241,0.06)" : file ? "rgba(99,102,241,0.04)" : "var(--bg2, #FAFAFA)",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>
              {file ? "📄" : "📂"}
            </div>
            {file ? (
              <>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text, #111827)", marginBottom: "4px" }}>
                  {file.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text3, #6B7280)" }}>
                  {(file.size / 1024).toFixed(1)} KB
                  {fileParsing && " · Parsing..."}
                  {!fileParsing && fileRows.length > 0 && ` · ${fileRows.length} rows detected`}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setFileRows([]); setFileError(""); }}
                  style={{ marginTop: "8px", fontSize: "11px", color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}
                >
                  ✕ Remove
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text, #111827)", marginBottom: "4px" }}>
                  {isDragging ? "Drop your file here" : "Drag & drop a CSV or PDF file"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text3, #9CA3AF)", marginBottom: "16px" }}>
                  CSV columns: <code>message</code>, <code>channel</code> (optional), <code>sender</code> (optional)
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  style={{
                    padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                    border: "1.5px solid var(--cyan, #6366F1)", background: "rgba(99,102,241,0.1)",
                    color: "var(--cyan, #4338CA)", cursor: "pointer",
                  }}
                >
                  Browse Files
                </button>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFilePick(e.target.files[0])}
            />
          </div>

          {fileError && (
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FEE2E2", color: "#991B1B", fontSize: "12px", marginBottom: "12px" }}>
              ⚠️ {fileError}
            </div>
          )}

          {/* Preview table */}
          {fileRows.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text3, #6B7280)", letterSpacing: "0.06em", marginBottom: "8px" }}>
                PREVIEW — FIRST {Math.min(fileRows.length, 5)} OF {fileRows.length} ROWS
              </div>
              <div style={{ border: "1px solid var(--border, #E5E7EB)", borderRadius: "10px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "var(--bg2, #F9FAFB)" }}>
                      {["#", "Channel", "Message", "Sender"].map((h) => (
                        <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: "600", color: "var(--text3, #6B7280)", borderBottom: "1px solid var(--border, #E5E7EB)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileRows.slice(0, 5).map((row) => (
                      <tr key={row.index} style={{ borderBottom: "1px solid var(--border, #E5E7EB)" }}>
                        <td style={{ padding: "9px 12px", color: "var(--text3, #9CA3AF)", fontFamily: "monospace" }}>{row.index + 1}</td>
                        <td style={{ padding: "9px 12px" }}><ChannelPill channel={row.channel} /></td>
                        <td style={{ padding: "9px 12px", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text, #111827)" }}>
                          {row.message}
                        </td>
                        <td style={{ padding: "9px 12px", color: "var(--text3, #9CA3AF)" }}>{row.sender || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Run button / Progress / Completed header ── */}
      <div className="card" style={{ marginBottom: "20px" }}>
        {scanError && (
          <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FEE2E2", color: "#991B1B", fontSize: "12px", marginBottom: "14px" }}>
            ⚠️ {scanError}
          </div>
        )}

        {/* Running — show real progress bar */}
        {isRunning && (
          <ProgressBar
            completed={jobProgress.completed}
            total={jobProgress.total}
            elapsedMs={elapsedMs}
            onCancel={cancelJob}
          />
        )}

        {/* Done / cancelled — show completion banner */}
        {isDone && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", flexWrap: "wrap", gap: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "22px" }}>
                {jobStatus === "cancelled" ? "🛑" : "✅"}
              </span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text, #111827)" }}>
                  {jobStatus === "cancelled" ? "Job cancelled" : "Batch complete"}
                  {" — "}
                  <span style={{ color: "var(--cyan, #6366F1)" }}>
                    {jobProgress.completed} of {jobProgress.total} analysed
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text3, #9CA3AF)", marginTop: "2px" }}>
                  Finished in {fmtElapsed(elapsedFinished)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {results?.length > 0 && (
                <button
                  onClick={() => downloadCsv(results, file?.name?.replace(/\.\w+$/, "") + "-results.csv" || "batch-results.csv")}
                  style={{
                    padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                    border: "1.5px solid #22C55E", background: "#F0FDF4",
                    color: "#166534", cursor: "pointer",
                  }}
                >
                  📥 Download CSV
                </button>
              )}
              <button
                onClick={resetPage}
                style={{
                  padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                  border: "1.5px solid var(--border, #E5E7EB)", background: "var(--bg2, #F9FAFB)",
                  color: "var(--text2, #374151)", cursor: "pointer",
                }}
              >
                ↩ New Batch
              </button>
            </div>
          </div>
        )}

        {/* Idle — show run button */}
        {!isRunning && !isDone && (
          <button
          type="button"
          onClick={runScan}
          disabled={!canScan}
          className="analyse-btn"
          style={{ opacity: canScan ? 1 : 0.4, cursor: canScan ? "pointer" : "not-allowed" }}
        >
          ▶ Run Batch Scan ({totalItems} {totalItems === 1 ? "item" : "items"})
        </button>
        )}
      </div>

      {/* ══════════════════════════════
          RESULTS
      ══════════════════════════════ */}
      {results && results.length > 0 && (
        <div className="card">
          {/* Summary chips */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            {[
              { label: "Total",  value: summary.total,  color: "var(--text, #111827)", bg: "var(--bg2, #F3F4F6)" },
              { label: "Fraud",  value: summary.fraud,  color: "#9F1239",  bg: "#FFE4E6" },
              { label: "Suspicious", value: summary.susp, color: "#92400E", bg: "#FEF3C7" },
              { label: "Safe",   value: summary.safe,   color: "#166534",  bg: "#DCFCE7" },
              ...(summary.errors ? [{ label: "Errors", value: summary.errors, color: "#6B7280", bg: "#F3F4F6" }] : []),
            ].map((chip) => (
              <div key={chip.label} style={{
                padding: "8px 16px", borderRadius: "10px", background: chip.bg,
                textAlign: "center", minWidth: "70px",
              }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: chip.color, lineHeight: 1 }}>{chip.value}</div>
                <div style={{ fontSize: "10px", color: chip.color, marginTop: "2px", fontWeight: "600", opacity: 0.8 }}>{chip.label}</div>
              </div>
            ))}
          </div>

          {/* Results table */}
          <div style={{ border: "1px solid var(--border, #E5E7EB)", borderRadius: "12px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--bg2, #F9FAFB)", borderBottom: "1px solid var(--border, #E5E7EB)" }}>
                  {["#", "Channel", "Message", "Verdict", "Score", ""].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "var(--text3, #6B7280)", letterSpacing: "0.05em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <ResultRow
                    key={result.index}
                    result={result}
                    isExpanded={!!expanded[result.index]}
                    onToggle={() => setExpanded((prev) => ({ ...prev, [result.index]: !prev[result.index] }))}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scanPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
