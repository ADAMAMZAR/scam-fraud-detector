/**
 * MOCK_MESSAGES - Sample messages for testing
 */
export const MOCK_MESSAGES = [
  {
    id: "msg_001",
    channel: "sms",
    sender: "+60123456789",
    body: "URGENT: Your Maybank account has been temporarily suspended due to suspicious activity. You must verify your identity within 2 hours or your account will be permanently closed. Click http://mybnk-secure.xyz immediately.",
    scam_score: 0.97,
    verdict: "SCAM",
    received_at: "2026-04-02T09:14:00Z",
    tactics: ["AUTHORITY_IMPERSONATION", "ARTIFICIAL_SCARCITY", "ACCOUNT_DEACTIVATION"],
    heatmap: [
      {
        sentence:
          "URGENT: Your Maybank account has been temporarily suspended due to suspicious activity.",
        tactics: ["AUTHORITY_IMPERSONATION", "ACCOUNT_DEACTIVATION"],
        intensity: 0.95,
      },
      {
        sentence:
          "You must verify your identity within 2 hours or your account will be permanently closed.",
        tactics: ["ARTIFICIAL_SCARCITY", "ACCOUNT_DEACTIVATION"],
        intensity: 0.98,
      },
      {
        sentence: "Click http://mybnk-secure.xyz immediately.",
        tactics: ["AUTHORITY_IMPERSONATION"],
        intensity: 0.72,
      },
    ],
  },
  {
    id: "msg_002",
    channel: "email",
    sender: "lhdn-notice@gov-my.info",
    body: "Dear Taxpayer, LHDN has detected an irregularity in your 2025 tax filing. A warrant for your arrest has been prepared and will be executed within 48 hours unless you pay RM 4,200 via the link below. This is your final notice. Do not contact your family about this matter.",
    scam_score: 0.99,
    verdict: "SCAM",
    received_at: "2026-04-01T14:22:00Z",
    tactics: ["AUTHORITY_IMPERSONATION", "LEGAL_THREAT", "ARTIFICIAL_SCARCITY", "ISOLATION_TACTIC"],
    heatmap: [
      {
        sentence:
          "Dear Taxpayer, LHDN has detected an irregularity in your 2025 tax filing.",
        tactics: ["AUTHORITY_IMPERSONATION"],
        intensity: 0.88,
      },
      {
        sentence:
          "A warrant for your arrest has been prepared and will be executed within 48 hours unless you pay RM 4,200 via the link below.",
        tactics: ["LEGAL_THREAT", "ARTIFICIAL_SCARCITY"],
        intensity: 0.99,
      },
      {
        sentence: "This is your final notice.",
        tactics: ["ARTIFICIAL_SCARCITY"],
        intensity: 0.82,
      },
      {
        sentence: "Do not contact your family about this matter.",
        tactics: ["ISOLATION_TACTIC"],
        intensity: 0.91,
      },
    ],
  },
  {
    id: "msg_003",
    channel: "whatsapp",
    sender: "+60187654321",
    body: "Congratulations! You have won RM 50,000 in the Touch n Go Lucky Draw! You are one of 3 winners selected from 2 million users. To claim your prize, you must provide your IC number and bank account details within 24 hours. Winners who do not respond will forfeit the prize.",
    scam_score: 0.95,
    verdict: "SCAM",
    received_at: "2026-04-02T07:55:00Z",
    tactics: ["PRIZE_LURE", "PERSONAL_DATA_REQUEST", "ARTIFICIAL_SCARCITY"],
    heatmap: [
      {
        sentence:
          "Congratulations! You have won RM 50,000 in the Touch n Go Lucky Draw!",
        tactics: ["PRIZE_LURE"],
        intensity: 0.91,
      },
      {
        sentence: "You are one of 3 winners selected from 2 million users.",
        tactics: ["PRIZE_LURE"],
        intensity: 0.75,
      },
      {
        sentence:
          "To claim your prize, you must provide your IC number and bank account details within 24 hours.",
        tactics: ["PERSONAL_DATA_REQUEST", "ARTIFICIAL_SCARCITY"],
        intensity: 0.97,
      },
      {
        sentence: "Winners who do not respond will forfeit the prize.",
        tactics: ["ARTIFICIAL_SCARCITY"],
        intensity: 0.84,
      },
    ],
  },
  {
    id: "msg_004",
    channel: "sms",
    sender: "+60111234567",
    body: "Hi, are you free this Saturday for the team lunch? We're thinking Damansara Uptown around 12:30pm. Please let me know by Friday!",
    scam_score: 0.03,
    verdict: "SAFE",
    received_at: "2026-04-02T11:30:00Z",
    tactics: [],
    heatmap: [
      {
        sentence: "Hi, are you free this Saturday for the team lunch?",
        tactics: [],
        intensity: 0.02,
      },
      {
        sentence: "We're thinking Damansara Uptown around 12:30pm.",
        tactics: [],
        intensity: 0.01,
      },
      {
        sentence: "Please let me know by Friday!",
        tactics: [],
        intensity: 0.04,
      },
    ],
  },
  {
    id: "msg_005",
    channel: "email",
    sender: "promo@shopee.com.my",
    body: "Your Shopee order #SPX-884421 has been shipped and is on its way. Expected delivery: 3-5 business days. Track your parcel at shopee.com.my/orders. Thank you for shopping with us!",
    scam_score: 0.08,
    verdict: "SAFE",
    received_at: "2026-04-01T16:45:00Z",
    tactics: [],
    heatmap: [
      {
        sentence:
          "Your Shopee order #SPX-884421 has been shipped and is on its way.",
        tactics: [],
        intensity: 0.05,
      },
      {
        sentence: "Expected delivery: 3-5 business days.",
        tactics: [],
        intensity: 0.03,
      },
      {
        sentence: "Track your parcel at shopee.com.my/orders.",
        tactics: [],
        intensity: 0.08,
      },
      {
        sentence: "Thank you for shopping with us!",
        tactics: [],
        intensity: 0.01,
      },
    ],
  },
  {
    id: "msg_006",
    channel: "whatsapp",
    sender: "+60199876543",
    body: "Your delivery attempt was unsuccessful. Reschedule within 48 hours to avoid return fees. Click here to confirm address: http://pos-laju-reschd.com",
    scam_score: 0.74,
    verdict: "SUSPICIOUS",
    received_at: "2026-03-31T10:10:00Z",
    tactics: ["ARTIFICIAL_SCARCITY", "ACCOUNT_DEACTIVATION"],
    heatmap: [
      {
        sentence: "Your delivery attempt was unsuccessful.",
        tactics: [],
        intensity: 0.12,
      },
      {
        sentence: "Reschedule within 48 hours to avoid return fees.",
        tactics: ["ARTIFICIAL_SCARCITY"],
        intensity: 0.78,
      },
      {
        sentence:
          "Click here to confirm address: http://pos-laju-reschd.com",
        tactics: ["ACCOUNT_DEACTIVATION"],
        intensity: 0.81,
      },
    ],
  },
];

/**
 * TREND_DATA - Historical trend data
 */
export const TREND_DATA = [
  { date: "Mar 27", scam: 14, suspicious: 8, safe: 42 },
  { date: "Mar 28", scam: 19, suspicious: 11, safe: 38 },
  { date: "Mar 29", scam: 11, suspicious: 6, safe: 51 },
  { date: "Mar 30", scam: 23, suspicious: 14, safe: 44 },
  { date: "Mar 31", scam: 31, suspicious: 9, safe: 37 },
  { date: "Apr 01", scam: 28, suspicious: 16, safe: 49 },
  { date: "Apr 02", scam: 17, suspicious: 10, safe: 55 },
];

/**
 * TACTIC_FREQ - Frequency of tactics
 */
export const TACTIC_FREQ = [
  { name: "Artificial Scarcity", count: 84 },
  { name: "Authority Impersonation", count: 61 },
  { name: "Account Deactivation", count: 53 },
  { name: "Legal Threat", count: 38 },
  { name: "Prize Lure", count: 29 },
  { name: "Personal Data Request", count: 25 },
  { name: "Isolation Tactic", count: 12 },
];

/**
 * CHANNEL_DATA - Channel distribution
 */
export const CHANNEL_DATA = [
  { name: "Email", value: 48, color: "#6366F1" },
  { name: "SMS", value: 31, color: "#EC4899" },
  { name: "WhatsApp", value: 21, color: "#10B981" },
];
