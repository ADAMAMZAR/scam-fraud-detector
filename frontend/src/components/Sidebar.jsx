import { NAV_ITEMS } from "../constants/config";

export function Sidebar({ activePage, onPageChange }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <img
              src="/logo.png"
              alt="ScamSense"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="logo-text">ScamSense</span>
            <span className="logo-sub">Enterprise AI</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1 }}>
        <div className="nav-section">
          <div className="nav-label">Main</div>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => onPageChange(item.id)}
              style={{ cursor: "pointer" }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badgeColor || ""}`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {/* <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">AD</div>
          <div>
            <div className="user-name">Admin</div>
            <div className="user-plan">Pro Plan</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}