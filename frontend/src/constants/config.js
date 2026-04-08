/**
 * VERDICT_CONFIG - Configuration for scam verdict verdicts
 */
export const VERDICT_CONFIG = {
  SCAM: {
    label: "SCAM",
    bg: "#FEF2F2",
    text: "#DC2626",
    border: "#FECACA",
    dot: "#EF4444",
    icon: "🚨",
  },
  SUSPICIOUS: {
    label: "SUSPICIOUS",
    bg: "#FFFBEB",
    text: "#D97706",
    border: "#FDE68A",
    dot: "#F59E0B",
    icon: "⚠️",
  },
  SAFE: {
    label: "SAFE",
    bg: "#F0FDF4",
    text: "#16A34A",
    border: "#BBF7D0",
    dot: "#22C55E",
    icon: "✅",
  },
};

/**
 * TACTIC_META - Metadata for scam tactics
 */
export const TACTIC_META = {
  ARTIFICIAL_SCARCITY: {
    label: "Artificial Scarcity",
    color: "#F97316",
    bg: "#FFF7ED",
    desc: "Creates false urgency through limited time or supply to pressure immediate action.",
  },
  AUTHORITY_IMPERSONATION: {
    label: "Authority Impersonation",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    desc: "Pretends to be a trusted institution (bank, government, platform) to gain compliance.",
  },
  LEGAL_THREAT: {
    label: "Legal Threat",
    color: "#EF4444",
    bg: "#FEF2F2",
    desc: "Fabricates legal or criminal consequences to induce fear and panic.",
  },
  ACCOUNT_DEACTIVATION: {
    label: "Account Deactivation",
    color: "#EC4899",
    bg: "#FDF2F8",
    desc: "Threatens to disable access to an account or service to coerce verification.",
  },
  PRIZE_LURE: {
    label: "Prize Lure",
    color: "#F59E0B",
    bg: "#FFFBEB",
    desc: "Promises unexpected rewards that require personal data or upfront fees to claim.",
  },
  PERSONAL_DATA_REQUEST: {
    label: "Personal Data Request",
    color: "#06B6D4",
    bg: "#ECFEFF",
    desc: "Directly solicits sensitive information such as IC, OTP, or bank credentials.",
  },
  ISOLATION_TACTIC: {
    label: "Isolation Tactic",
    color: "#64748B",
    bg: "#F8FAFC",
    desc: "Instructs the target to keep the interaction secret and not consult others.",
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
  { id: "messages", label: "Messages", icon: "📨", badge: "6", badgeColor: "red" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  // { id: "batch", label: "Batch Scan", icon: "📦" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];
