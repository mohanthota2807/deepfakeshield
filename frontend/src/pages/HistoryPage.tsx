import React, { useState } from 'react';
import { ForensicAnalysisResult } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';

interface HistoryPageProps {
  history: ForensicAnalysisResult[];
  onViewReport: (result: ForensicAnalysisResult) => void;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onViewReport,
  onDeleteRecord,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [verdictFilter, setVerdictFilter] = useState<'all' | 'DEEPFAKE' | 'AUTHENTIC' | 'UNCERTAIN'>('all');

  const filteredHistory = history.filter((item) => {
    // Search filter
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType = typeFilter === 'all' || item.media_type === typeFilter;

    // Verdict filter
    let matchesVerdict = true;
    if (verdictFilter !== 'all') {
      if (verdictFilter === 'DEEPFAKE') {
        matchesVerdict = item.verdict === 'DEEPFAKE' || item.verdict === 'AI-GENERATED';
      } else {
        matchesVerdict = item.verdict === verdictFilter;
      }
    }

    return matchesSearch && matchesType && matchesVerdict;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
            Analysis History & Forensic Logs
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of ingested digital media specimens, model attributions, and chain of custody hashes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to purge all local forensic audit logs?')) {
                  onClearHistory();
                }
              }}
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-mono transition-colors"
            >
              Purge Audit Log
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search Toolbar (Section 17) */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search forensic specimens by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded py-1.5 pl-9 pr-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Media Type Filters */}
          <div className="flex flex-wrap items-center gap-1 text-xs font-mono">
            <span className="text-slate-400 text-[11px] mr-1">MEDIA:</span>
            {(['all', 'image', 'video', 'audio'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  typeFilter === t
                    ? 'bg-slate-700 text-slate-100 font-bold border border-slate-600'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Verdict Filters */}
          <div className="flex flex-wrap items-center gap-1 text-xs font-mono">
            <span className="text-slate-400 text-[11px] mr-1">VERDICT:</span>
            {(['all', 'DEEPFAKE', 'AUTHENTIC', 'UNCERTAIN'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  verdictFilter === v
                    ? 'bg-slate-700 text-slate-100 font-bold border border-slate-600'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table (Section 17 Columns: File, Type, Result, Confidence, Date, Processing time, Actions) */}
      <div className="border border-slate-800 rounded-lg bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-3">File</th>
                <th className="p-3">Type</th>
                <th className="p-3">Result</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Date</th>
                <th className="p-3">Processing Time</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20">
                    <td className="p-3">
                      <div className="font-semibold text-slate-200 truncate max-w-[220px]">
                        {item.filename}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        ID: {item.id.slice(0, 16)}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.media_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <VerdictBadge verdict={item.verdict} size="sm" />
                    </td>
                    <td className="p-3 text-slate-300">
                      {item.confidence ? `${item.confidence.toFixed(1)}%` : '—'}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {item.processing_time_ms ? `${item.processing_time_ms.toFixed(1)} ms` : '—'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onViewReport(item)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 transition-colors"
                        >
                          View Report
                        </button>
                        <button
                          onClick={() => onDeleteRecord(item.id)}
                          title="Delete from audit history"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No matching forensic analysis records located.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
