import React from 'react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  backendOperational: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  isDemoMode,
  onToggleDemoMode,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  backendOperational
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 px-4 flex items-center justify-between">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-900"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded bg-sky-950 border border-sky-800/80 flex items-center justify-center text-sky-400 font-mono font-bold text-xs tracking-wider">
            DFS
          </div>
          <span className="font-mono text-sm font-bold tracking-tight text-slate-100 hidden sm:inline">
            DeepFake<span className="text-sky-400">Shield</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded hidden md:inline">
            v1.0-forensics
          </span>
        </div>
      </div>

      {/* Center Nav Link Shortcuts */}
      <nav className="hidden lg:flex items-center gap-1 text-xs font-mono">
        <button
          onClick={() => onNavigate('landing')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'landing' ? 'text-sky-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'dashboard' ? 'text-sky-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Console
        </button>
        <button
          onClick={() => onNavigate('image')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'image' ? 'text-sky-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Image
        </button>
        <button
          onClick={() => onNavigate('video')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'video' ? 'text-sky-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Video
        </button>
        <button
          onClick={() => onNavigate('audio')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'audio' ? 'text-sky-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Audio
        </button>
        <button
          onClick={() => onNavigate('multimodal')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'multimodal' ? 'text-sky-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Multimodal
        </button>
      </nav>

      {/* Right System Indicators & Demo Toggle */}
      <div className="flex items-center gap-3">
        {/* Backend health status pill */}
        <div
          title={backendOperational ? 'Backend REST API connected' : 'Client-side forensic engine active'}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendOperational ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span className="text-slate-400">API:</span>
          <span className="text-slate-200">{backendOperational ? 'Active' : 'Offline / Emulated'}</span>
        </div>

        {/* Demo Mode Toggle Badge */}
        <button
          onClick={onToggleDemoMode}
          title="Toggle Demo Mode (Simulated vs Real Model Engine)"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
            isDemoMode
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>DEMO MODE:</span>
          <span className="font-bold">{isDemoMode ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => onNavigate('image')}
          className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium transition-colors hidden sm:block"
        >
          Analyze Media
        </button>
      </div>
    </header>
  );
};
