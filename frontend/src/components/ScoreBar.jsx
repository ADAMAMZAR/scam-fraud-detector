/**
 * ScoreBar - Visual representation of scam score
 */
export function ScoreBar({ score, verdict }) {
  const colorMap = {
    SCAM: "#EF4444",
    SUSPICIOUS: "#F59E0B",
    SAFE: "#22C55E",
  };
  const color = colorMap[verdict] || "#22C55E";

  return (
    <div className="score-bar-wrap">
      <div
        className="score-bar"
        style={{ width: `${score * 100}%`, background: color }}
      />
    </div>
  );
}
