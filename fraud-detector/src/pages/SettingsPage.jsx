import { useState } from "react";
import { Toggle } from "../components/Toggle";

/**
 * SettingsPage - Application settings
 */
export function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: true,
    autoAnalyze: false,
    dataRetention: 30,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "24px" }}>Settings</h2>

      {/* Notification Settings */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "16px", color: "var(--text2)" }}>
          NOTIFICATIONS
        </h3>
        <div className="settings-row">
          <div className="settings-label">
            <strong>Email Notifications</strong>
            <span>Receive alerts for high-risk messages</span>
          </div>
          <Toggle
            on={settings.emailNotifications}
            onToggle={() => handleToggle("emailNotifications")}
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "16px", color: "var(--text2)" }}>
          PRIVACY
        </h3>
        <div className="settings-row">
          <div className="settings-label">
            <strong>Auto Analysis</strong>
            <span>Automatically analyze incoming messages</span>
          </div>
          <Toggle on={settings.autoAnalyze} onToggle={() => handleToggle("autoAnalyze")} />
        </div>
        <div className="settings-row">
          <div className="settings-label">
            <strong>Data Retention</strong>
            <span>Keep message history for {settings.dataRetention} days</span>
          </div>
          <input
            type="number"
            value={settings.dataRetention}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                dataRetention: parseInt(e.target.value),
              }))
            }
            style={{
              width: "60px",
              padding: "6px 8px",
              background: "var(--surface2)",
              border: "1px solid var(--border2)",
              borderRadius: "6px",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* API Key */}
      <div>
        <h3 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "16px", color: "var(--text2)" }}>
          API KEY
        </h3>
        <div className="api-key-row">
          <div className="api-key-val">sk_live_51234567890abcdef</div>
          <button className="copy-btn">Copy</button>
        </div>
      </div>
    </div>
  );
}
