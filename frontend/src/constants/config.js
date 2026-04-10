/**
 * VERDICT_CONFIG - Configuration for scam verdicts
 */
export const VERDICT_CONFIG = {
  SCAM: {
    label: "SCAM",
    bg: "rgba(239, 68, 68, 0.08)",
    text: "var(--red)",
    border: "rgba(239, 68, 68, 0.2)",
    dot: "var(--red)",
    icon: "🚨",
  },
  FRAUD: {
    label: "FRAUD",
    bg: "rgba(239, 68, 68, 0.08)",
    text: "var(--red)",
    border: "rgba(239, 68, 68, 0.2)",
    dot: "var(--red)",
    icon: "🚨",
  },
  SUSPICIOUS: {
    label: "SUSPICIOUS",
    bg: "rgba(245, 158, 11, 0.08)",
    text: "var(--amber)",
    border: "rgba(245, 158, 11, 0.2)",
    dot: "var(--amber)",
    icon: "⚠️",
  },
  SAFE: {
    label: "SAFE",
    bg: "rgba(16, 185, 129, 0.08)",
    text: "var(--green)",
    border: "rgba(16, 185, 129, 0.2)",
    dot: "var(--green)",
    icon: "✅",
  },
};

/**
 * TACTIC_META - Metadata for scam tactics
 */
export const TACTIC_META = {
  ARTIFICIAL_SCARCITY: {
    label: "Artificial Scarcity",
    color: "var(--amber)",
    bg: "rgba(245, 158, 11, 0.1)",
    desc: "Creates false urgency through limited time or supply to pressure immediate action.",
  },
  AUTHORITY_IMPERSONATION: {
    label: "Authority Impersonation",
    color: "var(--indigo-dark)",
    bg: "rgba(99, 102, 241, 0.1)",
    desc: "Pretends to be a trusted institution (bank, government, platform) to gain compliance.",
  },
  LEGAL_THREAT: {
    label: "Legal Threat",
    color: "var(--red)",
    bg: "rgba(239, 68, 68, 0.1)",
    desc: "Fabricates legal or criminal consequences to induce fear and panic.",
  },
  ACCOUNT_DEACTIVATION: {
    label: "Account Deactivation",
    color: "#EC4899",
    bg: "rgba(236, 72, 153, 0.1)",
    desc: "Threatens to disable access to an account or service to coerce verification.",
  },
  PRIZE_LURE: {
    label: "Prize Lure",
    color: "var(--amber)",
    bg: "rgba(245, 158, 11, 0.1)",
    desc: "Promises unexpected rewards that require personal data or upfront fees to claim.",
  },
  REWARD_LURE: {
    label: "Reward Lure",
    color: "var(--amber)",
    bg: "rgba(245, 158, 11, 0.1)",
    desc: "Promises unexpected rewards, money, or benefits to entice the victim.",
  },
  URGENCY_THREAT: {
    label: "Urgency & Threat",
    color: "var(--red)",
    bg: "rgba(239, 68, 68, 0.1)",
    desc: "Uses extreme urgency or threats of consequences to pressure immediate action.",
  },
  FEAR_APPEAL: {
    label: "Fear Appeal",
    color: "var(--red)",
    bg: "rgba(239, 68, 68, 0.1)",
    desc: "Exploits fear of loss, security breaches, or legal trouble to induce compliance.",
  },
  SOCIAL_PROOF: {
    label: "Social Proof",
    color: "var(--primary)",
    bg: "rgba(37, 99, 235, 0.1)",
    desc: "Uses fake testimonials or popularity claims to build false trust.",
  },
  PERSONAL_DATA_REQUEST: {
    label: "Personal Data Request",
    color: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.1)",
    desc: "Directly solicits sensitive information such as IC, OTP, or bank credentials.",
  },
  ISOLATION_TACTIC: {
    label: "Isolation Tactic",
    color: "var(--text3)",
    bg: "var(--bg-hover)",
    desc: "Instructs the target to keep the interaction secret and not consult others.",
  },
  NEUTRAL: {
    label: "Neutral",
    color: "var(--text3)",
    bg: "var(--bg-hover)",
    desc: "No significant fraud tactics detected in this segment.",
  },
};

/**
 * CHANNEL_ICONS - Icons for communication channels
 */
export const CHANNEL_ICONS = {
  email: "✉️",
  sms: "💬",
  whatsapp: "📱",
};

/**
 * Navigation items
 */
export const NAV_ITEMS = [
  { id: "analyse", label: "Analyse", icon: "🔍" },
  { id: "history", label: "History", icon: "🕒", badge: "6", badgeColor: "red" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "batch", label: "Batch Scan", icon: "📦" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];
