/**
 * GlobalStyles - Injected CSS styles
 */
export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root, [data-theme="dark"] {
        --bg: #0A0F1E;
        --surface: #111827;
        --surface2: #1A2236;
        --border: rgba(255,255,255,0.07);
        --border2: rgba(255,255,255,0.12);
        --accent: #6366F1;
        --accent2: #EC4899;
        --accent3: #10B981;
        --text: #F1F5F9;
        --text2: #94A3B8;
        --text3: #475569;
        --font-display: 'Syne', sans-serif;
        --font-body: 'DM Sans', sans-serif;
      }

      [data-theme="light"] {
        --bg: #F8FAFC;
        --surface: #FFFFFF;
        --surface2: #F1F5F9;
        --border: rgba(0,0,0,0.08);
        --border2: rgba(0,0,0,0.14);
        --accent: #6366F1;
        --accent2: #EC4899;
        --accent3: #10B981;
        --text: #0F172A;
        --text2: #475569;
        --text3: #94A3B8;
        --font-display: 'Syne', sans-serif;
        --font-body: 'DM Sans', sans-serif;
      }

      body {
        background: var(--bg);
        color: var(--text);
        font-family: var(--font-body);
        min-height: 100vh;
        overflow-x: hidden;
      }

      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: var(--surface); }
      ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

      .app-shell { display: flex; min-height: 100vh; }

      /* ── Sidebar ── */
      .sidebar {
        width: 220px; min-height: 100vh; background: var(--surface);
        border-right: 1px solid var(--border);
        display: flex; flex-direction: column;
        position: fixed; top: 0; left: 0; z-index: 100;
        padding: 0 0 24px 0;
      }
      .sidebar-logo {
        padding: 24px 20px 20px;
        border-bottom: 1px solid var(--border);
        margin-bottom: 12px;
      }
      .logo-mark {
        display: flex; align-items: center; gap: 10px;
      }
      .logo-icon {
        width: 34px; height: 34px; border-radius: 9px;
        background: linear-gradient(135deg, var(--accent), var(--accent2));
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; flex-shrink: 0;
      }
      .logo-text { font-family: var(--font-display); font-weight: 700; font-size: 14px; line-height: 1.2; }
      .logo-sub  { font-size: 9px; color: var(--text3); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px; }

      .nav-section { padding: 0 12px; margin-bottom: 4px; }
      .nav-label { font-size: 9px; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; padding: 8px 8px 4px; }
      .nav-item {
        display: flex; align-items: center; gap: 10px;
        padding: 9px 10px; border-radius: 8px; cursor: pointer;
        font-size: 13px; color: var(--text2); transition: all 0.15s;
        margin-bottom: 1px; font-weight: 500;
      }
      .nav-item:hover { background: var(--surface2); color: var(--text); }
      .nav-item.active { background: rgba(99,102,241,0.15); color: var(--accent); }
      .nav-item.active .nav-dot { background: var(--accent); }
      .nav-icon { width: 16px; text-align: center; font-size: 14px; }
      .nav-badge { margin-left: auto; background: var(--accent); color: white; font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
      .nav-badge.red { background: #EF4444; }

      .sidebar-footer { margin-top: auto; padding: 0 12px; }
      .user-card {
        display: flex; align-items: center; gap: 10px;
        padding: 10px; border-radius: 10px; background: var(--surface2);
        border: 1px solid var(--border);
      }
      .user-avatar {
        width: 30px; height: 30px; border-radius: 8px;
        background: linear-gradient(135deg, #6366F1, #EC4899);
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700; color: white;
      }
      .user-name { font-size: 12px; font-weight: 600; }
      .user-plan { font-size: 10px; color: var(--text3); }

      /* ── Main ── */
      .main-content { margin-left: 220px; flex: 1; min-height: 100vh; }

      .topbar {
        height: 60px; border-bottom: 1px solid var(--border);
        display: flex; align-items: center; padding: 0 28px;
        gap: 16px; position: sticky; top: 0; z-index: 50;
        background: rgba(var(--bg-rgb, 10,15,30), 0.85); backdrop-filter: blur(12px);
      }
      .page-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; }
      .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
      .topbar-btn {
        padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 600;
        cursor: pointer; border: none; transition: all 0.15s;
        font-family: var(--font-body);
      }
      .topbar-btn.ghost { background: var(--surface2); color: var(--text2); border: 1px solid var(--border2); }
      .topbar-btn.primary { background: var(--accent); color: white; }
      .topbar-btn:hover { opacity: 0.85; transform: translateY(-1px); }

      .page-body { padding: 28px; }

      /* ── Cards ── */
      .card {
        background: var(--surface); border: 1px solid var(--border);
        border-radius: 14px; padding: 20px;
      }
      .card-sm { padding: 16px; }
      .card-title { font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--text2); letter-spacing: 0.02em; margin-bottom: 16px; }

      /* ── Stats row ── */
      .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
      .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden; }
      .stat-glow { position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; opacity: 0.12; }
      .stat-label { font-size: 11px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
      .stat-value { font-family: var(--font-display); font-size: 28px; font-weight: 800; line-height: 1; }
      .stat-delta { font-size: 11px; margin-top: 6px; display: flex; align-items: center; gap: 4px; }
      .delta-up { color: #10B981; }
      .delta-dn { color: #EF4444; }

      /* ── Grid layouts ── */
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

      /* ── Message list ── */
      .msg-row {
        display: flex; align-items: flex-start; gap: 14px;
        padding: 14px 16px; border-radius: 10px; cursor: pointer;
        transition: all 0.15s; border: 1px solid transparent;
        margin-bottom: 6px;
      }
      .msg-row:hover { background: var(--surface2); border-color: var(--border); }
      .msg-row.selected { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.3); }
      .channel-chip {
        width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 15px; background: var(--surface2); border: 1px solid var(--border);
      }
      .msg-sender { font-size: 12px; font-weight: 600; color: var(--text); }
      .msg-preview { font-size: 11px; color: var(--text3); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
      .msg-meta { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
      .msg-time { font-size: 10px; color: var(--text3); }

      /* ── Verdict badge ── */
      .verdict-badge {
        font-size: 9px; font-weight: 800; padding: 2px 8px;
        border-radius: 20px; letter-spacing: 0.06em; text-transform: uppercase;
      }

      /* ── Score bar ── */
      .score-bar-wrap { width: 100%; height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; margin-top: 4px; }
      .score-bar { height: 100%; border-radius: 2px; transition: width 0.6s cubic-bezier(.4,0,.2,1); }

      /* ── Heatmap ── */
      .heatmap-sentence {
        display: inline; border-radius: 3px; padding: 2px 0;
        cursor: pointer; position: relative; transition: all 0.2s;
        line-height: 2.2;
      }
      .heatmap-sentence:hover { filter: brightness(0.92); }
      .tactic-chip {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 10px; font-weight: 600; padding: 2px 8px;
        border-radius: 20px; margin: 2px 3px; white-space: nowrap;
      }

      /* ── Tooltip ── */
      .tooltip-box {
        position: absolute; background: #1E293B; border: 1px solid var(--border2);
        border-radius: 10px; padding: 12px 14px; z-index: 200;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 240px;
        font-size: 12px; pointer-events: none; top: calc(100% + 8px); left: 0;
      }
      .tooltip-tactic { font-family: var(--font-display); font-size: 11px; font-weight: 700; margin-bottom: 4px; }
      .tooltip-desc { color: var(--text2); font-size: 11px; line-height: 1.5; }
      .tooltip-intensity { margin-top: 8px; font-size: 10px; color: var(--text3); }

      /* ── Analyse panel ── */
      .analyse-textarea {
        width: 100%; background: var(--surface2); border: 1px solid var(--border2);
        border-radius: 10px; padding: 14px; color: var(--text);
        font-family: var(--font-body); font-size: 13px; line-height: 1.6;
        resize: vertical; min-height: 120px; outline: none; transition: border 0.2s;
      }
      .analyse-textarea:focus { border-color: var(--accent); }
      .analyse-textarea::placeholder { color: var(--text3); }

      .channel-select-row { display: flex; gap: 8px; margin: 12px 0; }
      .channel-opt {
        flex: 1; padding: 8px; border-radius: 8px; text-align: center;
        font-size: 12px; font-weight: 600; cursor: pointer;
        border: 1.5px solid var(--border2); background: transparent; color: var(--text2);
        transition: all 0.15s; font-family: var(--font-body);
      }
      .channel-opt.active { border-color: var(--accent); background: rgba(99,102,241,0.12); color: var(--accent); }

      .analyse-btn {
        width: 100%; padding: 12px; border-radius: 10px;
        background: linear-gradient(135deg, var(--accent), var(--accent2));
        color: white; font-family: var(--font-display); font-size: 13px;
        font-weight: 700; border: none; cursor: pointer; letter-spacing: 0.04em;
        transition: all 0.2s;
      }
      .analyse-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
      .analyse-btn:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }

      /* ── Tabs ── */
      .tab-row { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
      .tab {
        padding: 10px 16px; font-size: 12px; font-weight: 600; cursor: pointer;
        border-bottom: 2px solid transparent; color: var(--text3);
        transition: all 0.15s; margin-bottom: -1px;
      }
      .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

      /* ── Table ── */
      .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .data-table th { text-align: left; padding: 10px 12px; color: var(--text3); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; border-bottom: 1px solid var(--border); }
      .data-table td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--text2); vertical-align: middle; }
      .data-table tr:hover td { background: var(--surface2); }

      /* ── Filter row ── */
      .filter-row { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }
      .filter-select {
        background: var(--surface2); border: 1px solid var(--border2);
        color: var(--text2); padding: 7px 12px; border-radius: 8px; font-size: 12px;
        outline: none; cursor: pointer; font-family: var(--font-body);
      }
      .search-box {
        background: var(--surface2); border: 1px solid var(--border2);
        color: var(--text); padding: 7px 12px; border-radius: 8px; font-size: 12px;
        outline: none; flex: 1; font-family: var(--font-body);
      }
      .search-box::placeholder { color: var(--text3); }

      /* ── Result panel ── */
      .result-panel { background: var(--surface2); border-radius: 12px; padding: 20px; margin-top: 16px; }
      .result-verdict-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
      .verdict-score { font-family: var(--font-display); font-size: 36px; font-weight: 800; }
      .verdict-label-lg { font-family: var(--font-display); font-size: 18px; font-weight: 800; }

      /* ── Shimmer loading ── */
      @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
      .shimmer { background: linear-gradient(90deg, var(--surface2) 25%, var(--surface) 50%, var(--surface2) 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }

      /* ── Animations ── */
      @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      .fade-up { animation: fadeUp 0.4s cubic-bezier(.4,0,.2,1) both; }
      .fade-in { animation: fadeIn 0.3s ease both; }
      .scanning { animation: pulse 1.2s ease-in-out infinite; }

      @keyframes staggerIn {
        from { opacity: 0; transform: translateX(-10px); }
        to   { opacity: 1; transform: none; }
      }
      .stagger { animation: staggerIn 0.35s ease both; }

      /* ── Settings ── */
      .settings-row { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--border); gap: 16px; }
      .settings-label { flex: 1; }
      .settings-label strong { display: block; font-size: 13px; margin-bottom: 2px; }
      .settings-label span { font-size: 11px; color: var(--text3); }
      .toggle { width: 38px; height: 20px; background: var(--surface2); border-radius: 10px; cursor: pointer; position: relative; border: 1px solid var(--border2); transition: background 0.2s; flex-shrink: 0; }
      .toggle.on { background: var(--accent); border-color: var(--accent); }
      .toggle-knob { width: 14px; height: 14px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: left 0.2s; }
      .toggle.on .toggle-knob { left: 20px; }

      /* ── API key ── */
      .api-key-row { display: flex; align-items: center; gap: 10px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; }
      .api-key-val { font-family: monospace; font-size: 11px; color: var(--text2); flex: 1; }
      .copy-btn { font-size: 10px; padding: 4px 10px; border-radius: 6px; background: var(--surface); border: 1px solid var(--border2); color: var(--text3); cursor: pointer; font-family: var(--font-body); }

      /* ── Empty state ── */
      .empty-state { text-align: center; padding: 48px 20px; color: var(--text3); }
      .empty-icon { font-size: 36px; margin-bottom: 12px; }
      .empty-text { font-size: 13px; }

      /* ── Live dot ── */
      .live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent3); display: inline-block; margin-right: 6px; animation: pulse 1.5s ease-in-out infinite; }

      /* ── Progress bar ── */
      @keyframes progress { from { width: 0% } to { width: 68% } }
      .progress-bar { height: 4px; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 2px; animation: progress 1.8s ease forwards; }

      /* ── Responsive ── */
      @media (max-width: 900px) {
        .sidebar { display: none; }
        .main-content { margin-left: 0; }
        .stats-grid { grid-template-columns: repeat(2,1fr); }
        .grid-2, .grid-3 { grid-template-columns: 1fr; }
      }
        
    `}</style>
  );
}
