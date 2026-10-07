import React, { useState, useEffect } from 'react';
import { ForensicAnalysisResult } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ForensicReportModal } from './components/ForensicReportModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ImageAnalysisPage } from './pages/ImageAnalysisPage';
import { VideoAnalysisPage } from './pages/VideoAnalysisPage';
import { AudioAnalysisPage } from './pages/AudioAnalysisPage';
import { MultimodalAnalysisPage } from './pages/MultimodalAnalysisPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { ModelInfoPage } from './pages/ModelInfoPage';
import { SettingsPage } from './pages/SettingsPage';

import { checkBackendHealth } from './services/api';
import {
  getStoredHistory,
  deleteStoredHistoryRecord,
  clearAllStoredHistory
} from './services/storage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [backendOperational, setBackendOperational] = useState<boolean>(false);
  const [history, setHistory] = useState<ForensicAnalysisResult[]>([]);
  const [selectedReport, setSelectedReport] = useState<ForensicAnalysisResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Initialize history and backend health
  useEffect(() => {
    setHistory(getStoredHistory());
    checkBackendHealth().then((h) => setBackendOperational(h.operational));

    // Periodic health check
    const interval = setInterval(() => {
      checkBackendHealth().then((h) => setBackendOperational(h.operational));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReport = (result: ForensicAnalysisResult) => {
    setSelectedReport(result);
    setIsReportModalOpen(true);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteStoredHistoryRecord(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearAllStoredHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-900 selection:text-sky-200 antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        isMobileMenuOpen={isMobileOpen}
        setIsMobileMenuOpen={setIsMobileOpen}
        backendOperational={backendOperational}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar (Only visible when not on landing page or on mobile) */}
        {activeTab !== 'landing' && (
          <Sidebar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            backendOperational={backendOperational}
          />
        )}

        {/* Content Viewport */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all duration-200`}
        >
          {activeTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              recentAnalyses={history}
              onViewReport={handleOpenReport}
              backendOperational={backendOperational}
            />
          )}
          {activeTab === 'image' && (
            <ImageAnalysisPage
              onViewReport={handleOpenReport}
              isDemoMode={isDemoMode}
            />
          )}
          {activeTab === 'video' && (
            <VideoAnalysisPage
              onViewReport={handleOpenReport}
              isDemoMode={isDemoMode}
            />
          )}
          {activeTab === 'audio' && (
            <AudioAnalysisPage
              onViewReport={handleOpenReport}
              isDemoMode={isDemoMode}
            />
          )}
          {activeTab === 'multimodal' && (
            <MultimodalAnalysisPage
              onViewReport={handleOpenReport}
              isDemoMode={isDemoMode}
            />
          )}
          {activeTab === 'history' && (
            <HistoryPage
              history={history}
              onViewReport={handleOpenReport}
              onDeleteRecord={handleDeleteHistory}
              onClearHistory={handleClearHistory}
            />
          )}
          {activeTab === 'reports' && (
            <ReportsPage
              history={history}
              onViewReport={handleOpenReport}
            />
          )}
          {activeTab === 'models' && <ModelInfoPage />}
          {activeTab === 'settings' && (
            <SettingsPage
              isDemoMode={isDemoMode}
              onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
              backendOperational={backendOperational}
              onHealthCheckUpdated={setBackendOperational}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Forensic Report Modal */}
      <ForensicReportModal
        result={selectedReport}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default App;
