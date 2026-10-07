import React from 'react';
import { ForensicAnalysisResult } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  recentAnalyses: ForensicAnalysisResult[];
  onViewReport: (result: ForensicAnalysisResult) => void;
  backendOperational: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  recentAnalyses,
  onViewReport,
  backendOperational
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
            Forensic Investigation Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated deepfake detection and neural manipulation verification workstation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">STATUS:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Forensics Pipeline Active</span>
          </span>
        </div>
      </div>

      {/* Quick Analysis Cards (Section 4) */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Quick Forensic Analysis
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Image */}
          <div
            onClick={() => onNavigate('image')}
            className="p-4 rounded border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 mb-2.5 group-hover:border-sky-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-mono text-xs font-semibold text-slate-200">Image Analysis</h3>
              <p className="text-[11px] text-slate-400 mt-1">Analyze an image for facial boundaries, lighting, and synthetic artifacts.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-sky-400">
              <span>Launch</span>
              <span>→</span>
            </div>
          </div>

          {/* Video */}
          <div
            onClick={() => onNavigate('video')}
            className="p-4 rounded border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 mb-2.5 group-hover:border-sky-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-mono text-xs font-semibold text-slate-200">Video Analysis</h3>
              <p className="text-[11px] text-slate-400 mt-1">Analyze a video with frame-level tracking and suspicious timeline windowing.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-sky-400">
              <span>Launch</span>
              <span>→</span>
            </div>
          </div>

          {/* Audio */}
          <div
            onClick={() => onNavigate('audio')}
            className="p-4 rounded border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 mb-2.5 group-hover:border-sky-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-mono text-xs font-semibold text-slate-200">Audio Analysis</h3>
              <p className="text-[11px] text-slate-400 mt-1">Analyze an audio file for neural vocoder synthesis and voice cloning.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-sky-400">
              <span>Launch</span>
              <span>→</span>
            </div>
          </div>

          {/* Multimodal */}
          <div
            onClick={() => onNavigate('multimodal')}
            className="p-4 rounded border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 mb-2.5 group-hover:border-sky-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-mono text-xs font-semibold text-slate-200">Multimodal Fusion</h3>
              <p className="text-[11px] text-slate-400 mt-1">Execute cross-modal audio-visual feature fusion with attention weighting.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-sky-400">
              <span>Launch</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Row (Section 4: small status indicators rather than huge decorative cards) */}
      <div className="bg-slate-900/40 border border-slate-800 p-3 rounded">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            System & Pipeline Status:
          </span>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Image Model:</span>
              <span className="text-slate-200">EfficientNet-B4 + ViT (v2.4)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Video Model:</span>
              <span className="text-slate-200">RetinaFace + Bi-LSTM (v3.1)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Audio Model:</span>
              <span className="text-slate-200">AASIST Log-Mel (v2.2)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${backendOperational ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-slate-400">API Status:</span>
              <span className="text-slate-200">{backendOperational ? '200 OK (Port 8000)' : 'Fallback Mode'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses (Section 4) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Recent Analyses
          </h2>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-mono text-sky-400 hover:underline"
          >
            View Complete Audit Log →
          </button>
        </div>

        <div className="border border-slate-800 rounded bg-slate-900/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="p-3">Filename</th>
                  <th className="p-3">Media Type</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentAnalyses.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20">
                    <td className="p-3 font-medium text-slate-200 truncate max-w-[200px]">
                      {item.filename}
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
                    <td className="p-3">
                      <span className="text-[10px] text-emerald-400 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Completed</span>
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onViewReport(item)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 transition-colors"
                      >
                        Inspect Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
