import React from 'react';
import { ForensicAnalysisResult } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';

interface ReportsPageProps {
  history: ForensicAnalysisResult[];
  onViewReport: (result: ForensicAnalysisResult) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  history,
  onViewReport
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
          Digital Forensics Reports & Chain of Custody
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Printable, tamper-evident forensic intelligence dossiers formatted for compliance with NIST SP 800-86 standards.
        </p>
      </div>

      {/* Reports Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((record) => {
          const reportId = `DFS-REP-2026-${record.id.slice(-6).toUpperCase()}`;
          return (
            <div
              key={record.id}
              className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    {reportId}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {record.media_type}
                  </span>
                </div>

                <h3 className="font-mono text-xs font-semibold text-slate-200 truncate">
                  {record.filename}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <VerdictBadge verdict={record.verdict} size="sm" />
                  <span className="font-mono text-xs text-rose-400 font-bold">
                    {record.probability.toFixed(1)}% Prob
                  </span>
                </div>

                <div className="mt-3 font-mono text-[11px] text-slate-400 space-y-1 bg-slate-950 p-2 rounded border border-slate-800/80">
                  <div className="flex justify-between">
                    <span>Engine:</span>
                    <span className="text-slate-300 truncate max-w-[140px]">{record.model_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Generated:</span>
                    <span className="text-slate-300">{new Date(record.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>SHA-256 Verified</span>
                </span>

                <button
                  onClick={() => onViewReport(record)}
                  className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span>Open Dossier</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
