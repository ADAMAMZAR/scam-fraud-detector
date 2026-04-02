/**
 * Toggle - Binary switch component
 */
export function Toggle({ on, onToggle }) {
  return (
    <div className={`toggle ${on ? "on" : ""}`} onClick={onToggle}>
      <div className="toggle-knob" />
    </div>
  );
}
