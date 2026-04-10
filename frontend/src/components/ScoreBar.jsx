/**
 * ScoreBar - Visual representation of scam score
 */
export function ScoreBar({ score, verdict }) {
  const colorMap = {
    SCAM: "var(--red)",
    FRAUD: "var(--red)",
    SUSPICIOUS: "var(--amber)",
    SAFE: "var(--green)",
  };
  const color = colorMap[verdict] || "var(--green)";
  
  // Ensure score is a number and normalized (0.0 - 1.0)
  const normalizedScore = typeof score === "number" ? (score > 1 ? score / 100 : score) : 0;
  const percentage = Math.min(Math.max(normalizedScore * 100, 0), 100);

  return (
    <div className="score-bar-wrap">
      <div
        className="score-bar"
        style={{ width: `${percentage}%`, background: color }}
      />
    </div>
  );
}
