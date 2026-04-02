/**
 * Intensity to color mapping
 */
export function intensityToColor(intensity) {
  if (intensity < 0.1) return "rgba(226,232,240,0.30)";
  if (intensity < 0.3) return "rgba(34,197,94,0.20)";
  if (intensity < 0.55) return "rgba(250,204,21,0.25)";
  if (intensity < 0.75) return "rgba(249,115,22,0.40)";
  if (intensity < 0.9) return "rgba(239,68,68,0.45)";
  return "rgba(239,68,68,0.60)";
}

/**
 * Format ISO timestamp to readable format
 */
export function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-MY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
