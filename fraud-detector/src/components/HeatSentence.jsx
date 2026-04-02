import { useState, useRef } from "react";
import { TACTIC_META } from "../constants/config";
import { intensityToColor } from "../utils/formatters";

/**
 * HeatSentence - Individual sentence with tactic highlighting
 */
export function HeatSentence({ sentence, tactics, intensity, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const bg = intensityToColor(intensity);
  const mainTactic = tactics[0];
  const meta = mainTactic ? TACTIC_META[mainTactic] : null;

  return (
    <span
      ref={ref}
      className="heatmap-sentence stagger"
      style={{ background: bg, animationDelay: `${delay}ms`, position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {sentence}{" "}
      {hovered && meta && (
        <span className="tooltip-box fade-in">
          <div className="tooltip-tactic" style={{ color: meta.color }}>
            {meta.label}
          </div>
          <div className="tooltip-desc">{meta.desc}</div>
          <div className="tooltip-intensity">
            Intensity: {(intensity * 100).toFixed(0)}%
          </div>
        </span>
      )}
    </span>
  );
}
