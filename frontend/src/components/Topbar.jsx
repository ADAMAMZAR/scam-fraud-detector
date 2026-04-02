/**
 * Topbar - Page header with title and actions
 */
export function Topbar({ title, actions = [] }) {
  return (
    <div className="topbar">
      <div className="page-title">{title}</div>
      <div className="topbar-right">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`topbar-btn ${action.variant || "ghost"}`}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
