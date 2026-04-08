/**
 * GlobalStyles — Futuristic dark theme design system
 */
export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

      *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      /* ══════════════════════════════════════════
         CSS VARIABLES — DARK THEME
      ══════════════════════════════════════════ */
      :root, [data-theme="dark"] {
        /* Core colors */
        --cyan:         #00F5FF;
        --cyan-dim:     rgba(0, 245, 255, 0.15);
        --cyan-glow:    rgba(0, 245, 255, 0.4);
        --purple:       #8B5CF6;
        --purple-dim:   rgba(139, 92, 246, 0.15);
        --red:          #EF4444;
        --amber:        #F59E0B;
        --green:        #22C55E;

        /* Backgrounds */
        --bg:           #080B14;
        --bg-rgb:       8, 11, 20;
        --surface:      rgba(15, 20, 35, 0.92);
        --surface2:     rgba(20, 27, 48, 0.8);
        --bg-hover:     rgba(0, 245, 255, 0.05);
        --bg-input:     rgba(8, 11, 20, 0.9);

        /* Borders */
        --border:       rgba(0, 245, 255, 0.1);
        --border2:      rgba(0, 245, 255, 0.2);
        --border-hover: rgba(0, 245, 255, 0.35);
        --border-active:rgba(0, 245, 255, 0.6);

        /* Text */
        --text:         #F0F4FF;
        --text2:        #94A3B8;
        --text3:        #4A5568;

        /* Accents (legacy compat) */
        --accent:       var(--cyan);
        --accent2:      var(--purple);
        --accent3:      var(--green);

        /* Fonts */
        --font-display: 'Orbitron', monospace;
        --font-body:    'Inter', system-ui, sans-serif;
        --font-mono:    'JetBrains Mono', monospace;
        --font-ui:      'Inter', system-ui, sans-serif;

        /* Glows */
        --glow-cyan:    0 0 20px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1);
        --glow-purple:  0 0 20px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1);
        --glow-card:    0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,245,255,0.08);
      }

      /* ── Light theme override ── */
      [data-theme="light"] {
        --cyan:         #0891B2;
        --cyan-dim:     rgba(8, 145, 178, 0.12);
        --cyan-glow:    rgba(8, 145, 178, 0.3);
        --purple:       #7C3AED;
        --purple-dim:   rgba(124, 58, 237, 0.1);
        --red:          #DC2626;
        --amber:        #D97706;
        --green:        #16A34A;

        --bg:           #F0F4FF;
        --bg-rgb:       240, 244, 255;
        --surface:      rgba(255, 255, 255, 0.95);
        --surface2:     rgba(241, 245, 249, 0.9);
        --bg-hover:     rgba(8, 145, 178, 0.06);
        --bg-input:     rgba(255, 255, 255, 0.9);

        --border:       rgba(8, 145, 178, 0.15);
        --border2:      rgba(8, 145, 178, 0.25);
        --border-hover: rgba(8, 145, 178, 0.4);
        --border-active:rgba(8, 145, 178, 0.7);

        --text:         #0F172A;
        --text2:        #334155;
        --text3:        #64748B;

        --accent:       var(--cyan);
        --accent2:      var(--purple);
        --accent3:      var(--green);

        --glow-cyan:    0 0 16px rgba(8,145,178,0.2);
        --glow-purple:  0 0 16px rgba(124,58,237,0.2);
        --glow-card:    0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(8,145,178,0.1);
      }

      /* ══════════════════════════════════════════
         BASE
      ══════════════════════════════════════════ */
      html { height: 100%; }

      body {
        height: 100%;
        font-family: var(--font-body);
        font-size: 14px;
        line-height: 1.5;
        color: var(--text);
        background: var(--bg);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow: hidden;
      }

      h1, h2, h3, h4 {
        font-family: var(--font-display);
        font-weight: 600;
        color: var(--text);
        letter-spacing: 0.5px;
        line-height: 1.3;
      }

      h2 { font-size: 18px; margin-bottom: 4px; }
      h3 { font-size: 14px; }

      p  { color: var(--text2); line-height: 1.65; }

      /* ══════════════════════════════════════════
         SCROLLBARS
      ══════════════════════════════════════════ */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(0,245,255,0.12) transparent;
      }
      *::-webkit-scrollbar       { width: 4px; height: 4px; }
      *::-webkit-scrollbar-track { background: transparent; }
      *::-webkit-scrollbar-thumb { background: rgba(0,245,255,0.12); border-radius: 2px; }
      *::-webkit-scrollbar-thumb:hover { background: rgba(0,245,255,0.3); }

      /* ══════════════════════════════════════════
         APP SHELL — sidebar + main
      ══════════════════════════════════════════ */
      #root {
        position: relative;
        z-index: 10;
        display: flex;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }

      .app-shell {
        display: flex;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }

      /* ══════════════════════════════════════════
         SIDEBAR
      ══════════════════════════════════════════ */
      .sidebar {
        width: 260px;
        height: 100vh;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        padding: 20px 14px;
        background: rgba(6, 9, 18, 0.92);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-right: 1px solid var(--border);
        position: relative;
        overflow: hidden;
        z-index: 20;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Glowing right edge */
      .sidebar::before {
        content: '';
        position: absolute;
        top: 0; right: 0;
        width: 1px; height: 100%;
        background: linear-gradient(180deg, transparent 0%, var(--cyan) 25%, var(--purple) 75%, transparent 100%);
        opacity: 0.25;
        pointer-events: none;
      }

      .sidebar-logo {
        padding: 4px 6px 20px;
        border-bottom: 1px solid var(--border);
        margin-bottom: 6px;
      }

      .logo-mark {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo-icon img {
        width: 42px; height: 42px;
        filter: drop-shadow(0 0 12px rgba(0,245,255,0.6));
        transition: all 0.3s ease;
        flex-shrink: 0;
      }

      .logo-icon img:hover {
        transform: scale(1.1) rotate(5deg);
        filter: drop-shadow(0 0 24px rgba(0,245,255,0.9));
      }

      .logo-text {
        font-family: var(--font-display);
        font-size: 13px;
        font-weight: 600;
        color: var(--text);
        letter-spacing: 1.5px;
        line-height: 1.2;
      }

      .logo-sub {
        font-family: var(--font-mono);
        font-size: 9px;
        color: var(--cyan);
        letter-spacing: 2.5px;
        margin-top: 3px;
        opacity: 0.8;
      }

      /* ── Nav ── */
      .nav-container {
        flex: 1;
        padding-top: 4px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
      }
      .nav-container::-webkit-scrollbar { display: none; }

      .nav-section { padding: 0; }

      .nav-label {
        font-family: var(--font-mono);
        font-size: 9px;
        font-weight: 600;
        color: var(--text3);
        letter-spacing: 2.5px;
        text-transform: uppercase;
        padding: 16px 10px 8px;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 10px;
        border-radius: 10px;
        margin-bottom: 3px;
        cursor: pointer;
        position: relative;
        transition: all 0.22s ease;
        color: var(--text2);
        border: 1px solid transparent;
        text-decoration: none;
        user-select: none;
        font-size: 13px;
        font-weight: 500;
      }

      .nav-item:hover {
        background: var(--bg-hover);
        color: var(--text);
        border-color: var(--border);
        transform: translateX(4px);
      }

      .nav-item.active {
        background: linear-gradient(135deg, rgba(0,245,255,0.12) 0%, rgba(139,92,246,0.07) 100%);
        color: var(--cyan);
        border-color: rgba(0,245,255,0.22);
        box-shadow: 0 0 20px rgba(0,245,255,0.08), inset 0 0 20px rgba(0,245,255,0.02);
      }

      .active-line {
        position: absolute;
        left: 0; top: 22%; height: 56%; width: 2px;
        background: linear-gradient(180deg, var(--cyan), var(--purple));
        border-radius: 2px;
        box-shadow: 0 0 8px var(--cyan);
      }

      .nav-icon {
        font-size: 16px;
        width: 20px;
        text-align: center;
        flex-shrink: 0;
        line-height: 1;
      }

      .nav-text {
        font-size: 13px;
        font-weight: 500;
        flex: 1;
        letter-spacing: 0.2px;
      }

      .nav-badge {
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 20px;
        background: var(--red);
        color: #fff;
        box-shadow: 0 0 10px rgba(239,68,68,0.5);
        animation: badgePulse 2s ease-in-out infinite;
      }

      .nav-badge.red   { background: #EF4444; }
      .nav-badge.green { background: #22C55E; }
      .nav-badge.amber { background: #F59E0B; }

      @keyframes badgePulse {
        0%,100% { box-shadow: 0 0 8px rgba(239,68,68,0.4); }
        50%      { box-shadow: 0 0 18px rgba(239,68,68,0.7); }
      }

      /* ── User card ── */
      .sidebar-footer { flex-shrink: 0; margin-top: 8px; }

      .user-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(255,255,255,0.03);
        border: 1px solid var(--border);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .user-card:hover {
        border-color: rgba(0,245,255,0.3);
        background: rgba(0,245,255,0.04);
      }

      .user-avatar {
        width: 36px; height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cyan), var(--purple));
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-display);
        font-size: 12px; font-weight: 700; color: #000;
        flex-shrink: 0;
        box-shadow: 0 0 14px rgba(0,245,255,0.35);
      }

      .user-name {
        font-size: 13px; font-weight: 500; color: var(--text); line-height: 1.2;
      }

      .user-plan {
        font-family: var(--font-mono);
        font-size: 10px; color: var(--cyan);
        letter-spacing: 1px; opacity: 0.8;
      }

      /* ══════════════════════════════════════════
         MAIN CONTENT
      ══════════════════════════════════════════ */
      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-width: 0;
      }

      /* ── Topbar ── */
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 28px;
        border-bottom: 1px solid var(--border);
        background: rgba(6, 9, 18, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        flex-shrink: 0;
        z-index: 10;
        height: 60px;
        gap: 16px;
      }

      .page-title {
        font-family: var(--font-display);
        font-size: 16px; font-weight: 600;
        color: var(--text); letter-spacing: 1.5px;
      }

      .topbar-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .topbar-btn {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 8px 16px;
        border-radius: 9px;
        font-size: 12px; font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--font-ui);
        border: none;
        white-space: nowrap;
      }

      .topbar-btn.ghost {
        border: 1px solid var(--border);
        background: rgba(255,255,255,0.03);
        color: var(--text2);
      }

      .topbar-btn.ghost:hover {
        border-color: var(--border-hover);
        color: var(--text);
        background: var(--bg-hover);
      }

      .topbar-btn.primary {
        border: 1px solid rgba(0,245,255,0.4);
        background: linear-gradient(135deg, rgba(0,245,255,0.15), rgba(139,92,246,0.12));
        color: var(--cyan);
        font-family: var(--font-mono);
        letter-spacing: 0.5px;
      }

      .topbar-btn.primary:hover {
        border-color: var(--cyan);
        box-shadow: 0 0 16px rgba(0,245,255,0.2);
        color: #fff;
        transform: translateY(-1px);
      }

      /* ── Page / scroll area ── */
      .page-body,
      .page-area {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 28px 32px 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,245,255,0.15) transparent;
      }

      .page-body > *,
      .page-area > * {
        width: 100%;
        max-width: 860px;
      }

      /* Override for full-width layouts (e.g. messages master-detail) */
      .page-body > .full-width,
      .page-area > .full-width {
        max-width: 100%;
      }

      /* ══════════════════════════════════════════
         CARDS
      ══════════════════════════════════════════ */
      .card {
        background: var(--surface);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 24px;
        position: relative;
        overflow: hidden;
        transition: border-color 0.25s ease, box-shadow 0.25s ease;
      }

      /* Top shimmer on hover */
      .card::before {
        content: '';
        position: absolute;
        top: 0; left: 10%; right: 10%; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .card:hover { border-color: rgba(0,245,255,0.2); box-shadow: var(--glow-card); }
      .card:hover::before { opacity: 1; }

      /* Corner bracket */
      .card::after {
        content: '';
        position: absolute;
        top: 0; right: 0;
        width: 32px; height: 32px;
        border-top: 1px solid rgba(0,245,255,0.25);
        border-right: 1px solid rgba(0,245,255,0.25);
        border-radius: 0 14px 0 0;
        pointer-events: none;
      }

      .card-sm { padding: 16px; }

      .card-title {
        font-family: var(--font-display);
        font-size: 11px; font-weight: 600;
        color: var(--cyan);
        letter-spacing: 2px; text-transform: uppercase;
        margin-bottom: 16px;
        display: flex; align-items: center; gap: 8px;
      }

      .card-title::before {
        content: '//';
        font-family: var(--font-mono);
        opacity: 0.4; font-size: 10px;
      }

      /* ══════════════════════════════════════════
         STAT CARDS
      ══════════════════════════════════════════ */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-bottom: 20px;
        width: 100%;
      }

      .stat-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 20px 16px;
        position: relative;
        overflow: hidden;
        transition: all 0.25s ease;
      }

      .stat-card:hover {
        border-color: rgba(0,245,255,0.22);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      }

      .stat-glow {
        position: absolute;
        top: -20px; right: -20px;
        width: 80px; height: 80px;
        border-radius: 50%;
        filter: blur(28px);
        opacity: 0.22;
        transition: opacity 0.25s;
        pointer-events: none;
      }

      .stat-card:hover .stat-glow { opacity: 0.4; }

      .stat-label {
        font-family: var(--font-mono);
        font-size: 9px; font-weight: 600;
        color: var(--text3);
        letter-spacing: 1.5px; text-transform: uppercase;
        margin-bottom: 10px;
      }

      .stat-value {
        font-family: var(--font-display);
        font-size: 30px; font-weight: 700;
        color: var(--text); line-height: 1; margin-bottom: 8px;
      }

      .stat-delta {
        font-family: var(--font-mono);
        font-size: 10px;
        display: flex; align-items: center; gap: 4px;
      }

      .delta-up { color: var(--green); }
      .delta-dn { color: var(--red);   }

      /* ══════════════════════════════════════════
         GRID HELPERS
      ══════════════════════════════════════════ */
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; }
      .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; width: 100%; }

      /* ══════════════════════════════════════════
         BUTTONS
      ══════════════════════════════════════════ */
      .analyse-btn {
        width: 100%;
        padding: 14px 24px;
        border-radius: 10px;
        border: 1px solid rgba(0,245,255,0.35);
        background: linear-gradient(135deg, rgba(0,245,255,0.14) 0%, rgba(139,92,246,0.14) 100%);
        color: var(--cyan);
        font-family: var(--font-display);
        font-size: 12px; font-weight: 600;
        letter-spacing: 2px; text-transform: uppercase;
        cursor: pointer;
        transition: all 0.25s ease;
        position: relative; overflow: hidden;
        display: flex; align-items: center; justify-content: center; gap: 10px;
      }

      .analyse-btn:hover:not(:disabled) {
        border-color: var(--cyan);
        box-shadow: var(--glow-cyan);
        color: #fff;
        transform: translateY(-1px);
      }

      .analyse-btn:active:not(:disabled) { transform: translateY(0); }

      .analyse-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        transform: none;
      }

      /* ── Channel selector ── */
      .channel-select-row { display: flex; gap: 8px; flex-wrap: wrap; }

      .channel-opt {
        padding: 9px 18px;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: var(--bg-input);
        color: var(--text2);
        font-size: 13px; font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--font-ui);
      }

      .channel-opt:hover {
        border-color: var(--border-hover);
        color: var(--text);
        background: var(--bg-hover);
      }

      .channel-opt.active {
        background: linear-gradient(135deg, rgba(0,245,255,0.14), rgba(139,92,246,0.08));
        border-color: rgba(0,245,255,0.45);
        color: var(--cyan);
        box-shadow: 0 0 12px rgba(0,245,255,0.12);
      }

      /* ══════════════════════════════════════════
         FORM INPUTS
      ══════════════════════════════════════════ */
      textarea, .analyse-textarea,
      input[type="text"], input[type="url"],
      input[type="number"], input[type="password"],
      input[type="email"], select {
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: 10px;
        color: var(--text);
        font-family: var(--font-ui);
        font-size: 13px; line-height: 1.6;
        padding: 11px 14px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        outline: none;
        width: 100%;
      }

      textarea { resize: vertical; }

      textarea:focus, .analyse-textarea:focus,
      input[type="text"]:focus, input[type="url"]:focus,
      input[type="number"]:focus, input[type="password"]:focus,
      input[type="email"]:focus, select:focus {
        border-color: rgba(0,245,255,0.45);
        box-shadow: 0 0 0 3px rgba(0,245,255,0.06), 0 0 20px rgba(0,245,255,0.08);
        background: rgba(0,245,255,0.02);
      }

      textarea::placeholder, input::placeholder {
        color: var(--text3);
      }

      .analyse-textarea {
        min-height: 120px;
      }

      select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 36px;
      }

      input[type="range"] {
        background: transparent;
        border: none; padding: 0;
        cursor: pointer;
        accent-color: var(--cyan);
        width: 100%;
      }

      /* ── Search / filter ── */
      .search-box {
        background: var(--bg-input);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 9px 12px;
        border-radius: 8px;
        font-size: 12px;
        outline: none; flex: 1;
        font-family: var(--font-ui);
        transition: border-color 0.2s;
      }

      .search-box:focus { border-color: rgba(0,245,255,0.4); }
      .search-box::placeholder { color: var(--text3); }

      .filter-row { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }

      .filter-select {
        background: var(--bg-input);
        border: 1px solid var(--border);
        color: var(--text2);
        padding: 7px 12px;
        border-radius: 8px; font-size: 12px;
        outline: none; cursor: pointer;
        font-family: var(--font-ui);
      }

      /* ══════════════════════════════════════════
         TOGGLE SWITCH
      ══════════════════════════════════════════ */
      .toggle {
        width: 44px; height: 24px;
        border-radius: 12px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        cursor: pointer; position: relative;
        transition: all 0.25s ease;
        flex-shrink: 0;
      }

      .toggle.on {
        background: rgba(0,245,255,0.2);
        border-color: rgba(0,245,255,0.5);
        box-shadow: 0 0 12px rgba(0,245,255,0.2);
      }

      .toggle-knob {
        width: 16px; height: 16px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        position: absolute;
        top: 3px; left: 3px;
        transition: all 0.25s ease;
      }

      .toggle.on .toggle-knob {
        left: 23px;
        background: var(--cyan);
        box-shadow: 0 0 8px rgba(0,245,255,0.6);
      }

      /* ══════════════════════════════════════════
         MESSAGE LIST
      ══════════════════════════════════════════ */
      .msg-row {
        display: flex; align-items: flex-start; gap: 12px;
        padding: 12px 14px;
        border-bottom: 1px solid rgba(0,245,255,0.04);
        cursor: pointer;
        transition: all 0.15s ease;
        border-left: 2px solid transparent;
      }

      .msg-row:hover {
        background: var(--bg-hover);
        border-left-color: rgba(0,245,255,0.3);
      }

      .msg-row.selected {
        background: rgba(0,245,255,0.05);
        border-left-color: var(--cyan);
      }

      .channel-chip {
        width: 32px; height: 32px;
        border-radius: 8px;
        background: rgba(0,245,255,0.07);
        border: 1px solid var(--border);
        display: flex; align-items: center; justify-content: center;
        font-size: 14px; flex-shrink: 0;
      }

      .msg-sender {
        font-size: 13px; font-weight: 600;
        color: var(--text); margin-bottom: 3px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      .msg-preview {
        font-size: 11px; color: var(--text2);
        white-space: nowrap; overflow: hidden;
        text-overflow: ellipsis; max-width: 220px;
      }

      .msg-meta {
        display: flex; flex-direction: column;
        align-items: flex-end; gap: 5px;
        flex-shrink: 0; margin-left: auto;
      }

      .msg-time {
        font-family: var(--font-mono);
        font-size: 10px; color: var(--text3); white-space: nowrap;
      }

      /* ══════════════════════════════════════════
         VERDICT BADGE
      ══════════════════════════════════════════ */
      .verdict-badge {
        display: inline-block;
        font-family: var(--font-mono);
        font-size: 9px; font-weight: 700;
        padding: 3px 9px; border-radius: 10px;
        letter-spacing: 0.5px;
        white-space: nowrap; text-transform: uppercase;
      }

      /* ══════════════════════════════════════════
         SCORE BAR
      ══════════════════════════════════════════ */
      .score-bar-wrap {
        width: 100%; height: 6px;
        background: rgba(255,255,255,0.06);
        border-radius: 3px; overflow: hidden;
        margin-top: 6px;
      }

      .score-bar {
        height: 100%; border-radius: 3px;
        transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
      }

      /* ══════════════════════════════════════════
         HEATMAP
      ══════════════════════════════════════════ */
      .heatmap-sentence {
        display: inline;
        border-radius: 3px; padding: 2px 0;
        cursor: pointer; position: relative;
        transition: all 0.2s; line-height: 2.2;
      }

      .heatmap-sentence:hover { filter: brightness(0.85); }

      .tactic-chip {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 10px; font-weight: 600;
        padding: 2px 8px; border-radius: 20px;
        margin: 2px 3px; white-space: nowrap;
        font-family: var(--font-mono);
        letter-spacing: 0.5px;
      }

      /* ── Tooltip ── */
      .tooltip-box {
        position: absolute;
        background: rgba(10,14,26,0.98);
        border: 1px solid rgba(0,245,255,0.25);
        border-radius: 10px;
        padding: 12px 14px;
        z-index: 200;
        box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,245,255,0.08);
        width: 240px;
        font-size: 12px; pointer-events: none;
        top: calc(100% + 8px); left: 0;
        backdrop-filter: blur(12px);
      }

      .tooltip-tactic {
        font-family: var(--font-display);
        font-size: 11px; font-weight: 700;
        color: var(--cyan); margin-bottom: 4px;
        letter-spacing: 0.5px;
      }

      .tooltip-desc { color: var(--text2); font-size: 11px; line-height: 1.5; }

      .tooltip-intensity {
        margin-top: 8px;
        font-family: var(--font-mono);
        font-size: 10px; color: var(--text3); letter-spacing: 0.5px;
      }

      /* ══════════════════════════════════════════
         RESULT PANEL
      ══════════════════════════════════════════ */
      .result-panel {
        background: rgba(10,14,26,0.95);
        border-radius: 12px; padding: 20px;
        margin-top: 16px;
        border: 1px solid var(--border);
        backdrop-filter: blur(16px);
      }

      .result-verdict-row {
        display: flex; align-items: center;
        gap: 12px; margin-bottom: 16px;
      }

      .verdict-score {
        font-family: var(--font-display);
        font-size: 36px; font-weight: 800;
        line-height: 1;
      }

      .verdict-label-lg {
        font-family: var(--font-display);
        font-size: 18px; font-weight: 800;
        letter-spacing: 1px;
      }

      /* ══════════════════════════════════════════
         DATA TABLE
      ══════════════════════════════════════════ */
      .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }

      .data-table th {
        text-align: left; padding: 9px 12px;
        font-family: var(--font-mono);
        font-size: 9px; font-weight: 700;
        color: var(--text3); letter-spacing: 1.5px;
        text-transform: uppercase;
        border-bottom: 1px solid var(--border);
        white-space: nowrap;
      }

      .data-table td {
        padding: 10px 12px;
        color: var(--text2);
        border-bottom: 1px solid rgba(0,245,255,0.04);
        transition: all 0.15s ease;
        vertical-align: middle;
      }

      .data-table tr:hover td {
        background: var(--bg-hover);
        color: var(--text);
      }

      .data-table tr:last-child td { border-bottom: none; }

      /* ══════════════════════════════════════════
         SETTINGS
      ══════════════════════════════════════════ */
      .settings-row {
        display: flex; align-items: center;
        padding: 14px 0;
        border-bottom: 1px solid rgba(0,245,255,0.06);
        gap: 16px;
      }

      .settings-row:last-child { border-bottom: none; }

      .settings-label { flex: 1; }

      .settings-label strong {
        display: block; font-size: 13px;
        font-weight: 500; color: var(--text);
        margin-bottom: 2px;
      }

      .settings-label span {
        font-family: var(--font-mono);
        font-size: 10px; color: var(--text3); letter-spacing: 0.3px;
      }

      .api-key-row {
        display: flex; align-items: center; gap: 10px;
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: 8px; padding: 10px 14px; margin-bottom: 8px;
      }

      .api-key-val {
        font-family: var(--font-mono);
        font-size: 12px; color: var(--cyan);
        letter-spacing: 1px; flex: 1;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }

      .copy-btn {
        font-family: var(--font-mono);
        font-size: 10px; padding: 5px 12px;
        border-radius: 6px;
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text3); cursor: pointer;
        transition: all 0.2s; letter-spacing: 0.5px;
      }

      .copy-btn:hover { border-color: var(--cyan); color: var(--cyan); }

      /* ══════════════════════════════════════════
         DRAG & DROP ZONE
      ══════════════════════════════════════════ */
      .drop-zone {
        border: 2px dashed rgba(0,245,255,0.2);
        border-radius: 12px; padding: 40px 24px;
        text-align: center; cursor: pointer;
        background: rgba(255,255,255,0.02);
        transition: all 0.25s ease;
      }

      .drop-zone:hover, .drop-zone.drag-over {
        border-color: rgba(0,245,255,0.5);
        background: rgba(0,245,255,0.04);
        box-shadow: 0 0 24px rgba(0,245,255,0.08);
      }

      /* ══════════════════════════════════════════
         EMPTY STATE
      ══════════════════════════════════════════ */
      .empty-state {
        text-align: center; padding: 48px 20px;
        display: flex; flex-direction: column;
        align-items: center; gap: 10px;
      }

      .empty-icon { font-size: 32px; }

      .empty-text {
        font-family: var(--font-mono);
        font-size: 12px; color: var(--text3);
        letter-spacing: 0.5px; line-height: 1.7;
      }

      /* ══════════════════════════════════════════
         LIVE DOT
      ══════════════════════════════════════════ */
      .live-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: var(--green);
        display: inline-block; margin-right: 6px;
        box-shadow: 0 0 8px var(--green);
        animation: statusPulse 2s ease-in-out infinite;
      }

      @keyframes statusPulse {
        0%,100% { box-shadow: 0 0 6px var(--green); opacity: 1; }
        50%      { box-shadow: 0 0 16px var(--green); opacity: 0.7; }
      }

      /* ══════════════════════════════════════════
         PROGRESS BAR
      ══════════════════════════════════════════ */
      .progress-bar {
        height: 4px;
        background: linear-gradient(90deg, var(--cyan), var(--purple));
        border-radius: 2px;
        box-shadow: 0 0 8px rgba(0,245,255,0.4);
      }

      @keyframes progress { from { width: 0% } to { width: 68% } }

      /* ══════════════════════════════════════════
         SHIMMER LOADING
      ══════════════════════════════════════════ */
      @keyframes shimmer {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 0.8; }
      }

      .shimmer { animation: shimmer 1.5s ease-in-out infinite; }

      /* ══════════════════════════════════════════
         TABS
      ══════════════════════════════════════════ */
      .tab-row {
        display: flex; gap: 4px;
        border-bottom: 1px solid var(--border);
        margin-bottom: 20px;
      }

      .tab {
        padding: 10px 16px;
        font-family: var(--font-mono);
        font-size: 11px; font-weight: 600;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        color: var(--text3);
        transition: all 0.15s; margin-bottom: -1px;
        letter-spacing: 0.5px;
      }

      .tab.active { color: var(--cyan); border-bottom-color: var(--cyan); }

      /* ══════════════════════════════════════════
         ANIMATIONS
      ══════════════════════════════════════════ */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: none; }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      @keyframes slideIn {
        from { opacity: 0; transform: translateX(8px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }

      @keyframes toastIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes staggerIn {
        from { opacity: 0; transform: translateX(-10px); }
        to   { opacity: 1; transform: none; }
      }

      @keyframes orbFloat {
        0%,100% { transform: translate(0, 0) scale(1); }
        33%      { transform: translate(30px, -20px) scale(1.04); }
        66%      { transform: translate(-20px, 15px) scale(0.96); }
      }

      @keyframes pulse {
        0%,100% { opacity: 1; }
        50%      { opacity: 0.5; }
      }

      @keyframes shimmerSlide {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }

      @keyframes resultIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* Utility animation classes */
      .fade-up   { animation: fadeUp   0.4s cubic-bezier(.4,0,.2,1) both; }
      .fade-in   { animation: fadeIn   0.3s ease both; }
      .slide-in  { animation: slideIn  0.25s ease both; }
      .stagger   { animation: staggerIn 0.35s ease both; }
      .scanning  { animation: pulse    1.2s ease-in-out infinite; }
      .spin      { animation: spin     0.8s linear infinite; }

      /* ══════════════════════════════════════════
         RESPONSIVE
      ══════════════════════════════════════════ */
      @media (max-width: 1024px) {
        .page-body > *, .page-area > * { max-width: 720px; }
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
      }

      @media (max-width: 768px) {
        .sidebar      { width: 220px; }
        .page-body, .page-area { padding: 16px 16px 48px; }
        .topbar       { padding: 12px 16px; }
        .grid-2, .grid-3 { grid-template-columns: 1fr; }
        .stats-grid   { grid-template-columns: repeat(2, 1fr); }
        .page-body > *, .page-area > * { max-width: 100%; }
      }

      @media (max-width: 600px) {
        .sidebar    { display: none; }
        .main-content { margin-left: 0; }
        .stats-grid { grid-template-columns: 1fr 1fr; }
      }

      /* ══════════════════════════════════════════
         UTILITY CLASSES
      ══════════════════════════════════════════ */
      .text-cyan    { color: var(--cyan);   }
      .text-purple  { color: var(--purple); }
      .text-green   { color: var(--green);  }
      .text-red     { color: var(--red);    }
      .text-amber   { color: var(--amber);  }
      .text-muted   { color: var(--text2);  }
      .text-dim     { color: var(--text3);  }
      .font-mono    { font-family: var(--font-mono);    }
      .font-display { font-family: var(--font-display); }
      .glow-cyan    { box-shadow: var(--glow-cyan);   }
      .glow-purple  { box-shadow: var(--glow-purple); }
      .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .w-full { width: 100%; }
    `}</style>
  );
}