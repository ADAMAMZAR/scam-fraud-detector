import { NAV_ITEMS } from "../constants/config";

export function Sidebar({ activePage, onPageChange }) {
  return (
    <div className="sidebar">
      {/* Logo — NordVPN style */}
      <div className="sidebar-logo">
        <div className="logo-mark" style={{ gap: 10 }}>
          <img
            src="/logo.png"
            alt="Fraud Detector"
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
              flexShrink: 0,
              filter: "drop-shadow(0 0 8px rgba(0,245,255,0.5))",
            }}
          />
          <span
            className="logo-text"
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 0.3,
              whiteSpace: "nowrap",
            }}
          >
            Fraud Detector
          </span>
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
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">AD</div>
          <div>
            <div className="user-name">Admin</div>
            <div className="user-plan">Pro Plan</div>
          </div>
        </div>
      </div>
    </div>
  );
}