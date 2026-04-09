import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { GlobalStyles } from "./components/GlobalStyles";
import { AnalysePage } from "./pages/AnalysePage";
import { HistoryPage } from "./pages/HistoryPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { BatchPage } from "./pages/BatchPage";
import { SettingsPage } from "./pages/SettingsPage";

/**
 * App Root Component
 * Main application shell with routing and layout
 */

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("appSettings");
    if (!saved) return true; // Default Dark
    const { darkMode } = JSON.parse(saved);
    return darkMode ?? true;
  } catch {
    return true;
  }
}
const VALID_PAGES = ["analyse", "history", "analytics", "batch", "settings"];

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  return VALID_PAGES.includes(hash) ? hash : "analyse";
}

function App() {
  const [activePage, setActivePage] = useState(getPageFromHash);
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  // Apply theme immediately
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Keep URL hash in sync with active page
  useEffect(() => {
    window.location.hash = activePage;
  }, [activePage]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const onHashChange = () => setActivePage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Page configuration
  const pages = {
    analyse: {
      title: "Analyse",
      component: AnalysePage,
      actions: [],
    },
    history: {
      title: "History",
      component: HistoryPage,
    
    },
    analytics: {
      title: "Analytics",
      component: AnalyticsPage,
  
    },
    batch: {
      title: "Batch Scan",
      component: BatchPage,
      actions: [],
    },
    settings: {
      title: "Settings",
      component: () => (
        <SettingsPage 
          globalDarkMode={darkMode} 
          setGlobalDarkMode={setDarkMode} 
        />
      ),
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