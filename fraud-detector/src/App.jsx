import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { GlobalStyles } from "./components/GlobalStyles";
import { AnalysePage } from "./pages/AnalysePage";
import { MessagesPage } from "./pages/MessagesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { BatchPage } from "./pages/BatchPage";
import { SettingsPage } from "./pages/SettingsPage";

/**
 * App Root Component
 * Main application shell with routing and layout
 */
function App() {
  const [activePage, setActivePage] = useState("analyse");

  // Page configuration
  const pages = {
    analyse: {
      title: "Analyse",
      component: AnalysePage,
      actions: [],
    },
    messages: {
      title: "Messages",
      component: MessagesPage,
      actions: [
        { id: "refresh", label: "Refresh", variant: "ghost", onClick: () => {} },
        { id: "export", label: "Export", variant: "primary", onClick: () => {} },
      ],
    },
    analytics: {
      title: "Analytics",
      component: AnalyticsPage,
      actions: [
        { id: "download", label: "Download Report", variant: "ghost", onClick: () => {} },
      ],
    },
    batch: {
      title: "Batch Scan",
      component: BatchPage,
      actions: [],
    },
    settings: {
      title: "Settings",
      component: SettingsPage,
      actions: [
        { id: "save", label: "Save Settings", variant: "primary", onClick: () => {} },
      ],
    },
  };

  const currentPage = pages[activePage];
  const PageComponent = currentPage.component;

  return (
    <>
      <GlobalStyles />
      <div className="app-shell">
        {/* Sidebar */}
        <Sidebar activePage={activePage} onPageChange={setActivePage} />

        {/* Main Content */}
        <div className="main-content">
          {/* Topbar */}
          <Topbar title={currentPage.title} actions={currentPage.actions} />

          {/* Page Content */}
          <div className="page-body">
            <PageComponent />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;