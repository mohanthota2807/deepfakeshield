import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-6 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <span>DEEPFAKESHIELD</span>
            <span className="text-[10px] text-slate-400 font-normal">| AI Media Forensics Platform</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
            AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof. Designed according to NIST SP 800-86 digital evidence principles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <button onClick={() => onNavigate('models')} className="hover:text-slate-200">
            Model Registry
          </button>
          <button onClick={() => onNavigate('reports')} className="hover:text-slate-200">
            Chain of Custody
          </button>
          <button onClick={() => onNavigate('settings')} className="hover:text-slate-200">
            API Config
          </button>
          <span className="text-slate-400">UTC: {new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>
    </footer>
  );
};
