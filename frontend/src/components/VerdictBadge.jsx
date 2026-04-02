import { VERDICT_CONFIG } from "../constants/config";

/**
 * VerdictBadge - Displays verdict status (SCAM, SUSPICIOUS, SAFE)
 */
export function VerdictBadge({ verdict }) {
  const c = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.SAFE;
  return (
    <span
      className="verdict-badge"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {c.label}
    </span>
  );
}
