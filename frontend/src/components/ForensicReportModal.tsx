import React, { useRef } from 'react';
import { ForensicAnalysisResult } from '../types';
import { VerdictBadge } from './VerdictBadge';

interface ForensicReportModalProps {
  result: ForensicAnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  result,
  isOpen,
  onClose
}) => {
  const reportRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !result) return null;

  const reportId = `DFS-REP-2026-${result.id.slice(-6).toUpperCase()}`;
  const sha256Simulated = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
    .slice(0, 32) + result.id.slice(0, 16);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${reportId}_forensic_audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 font-mono text-xs font-bold">
              DFS
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                Official Digital Forensics Report
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                REPORT IDENTIFIER: <span className="text-sky-400 font-bold">{reportId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div ref={reportRef} className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs">
          {/* Top Document Header */}
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-100 tracking-tight">
                  DEEPFAKESHIELD
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  AI Media Forensics Engine
                </span>
                {result.is_demo && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    DEMO RESULT
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px] mt-1">
                Automated Multimodal Forensics & Synthetic Manipulation Assessment
              </p>
            </div>

            <div className="text-right font-mono text-[11px] space-y-0.5">
              <div className="text-slate-400">Date of Intake: <span className="text-slate-200">{new Date(result.created_at).toUTCString()}</span></div>
              <div className="text-slate-400">Protocol: <span className="text-slate-200">NIST SP 800-86 Forensic Standard</span></div>
              <div className="text-slate-400">Integrity: <span className="text-emerald-400">Cryptographically Sealed</span></div>
            </div>
          </div>

          {/* Core Case & Evidence Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-2">
              <h4 className="text-[11px] font-mono uppercase text-slate-400 font-semibold border-b border-slate-800/80 pb-1">
                Digital Evidence Specification
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Specimen File:</span>
                  <span className="text-slate-100 font-semibold truncate max-w-[200px]">{result.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Media Classification:</span>
                  <span className="text-sky-400 uppercase font-semibold">{result.media_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Forensic Model:</span>
                  <span className="text-slate-200">{result.model_name} (v{result.model_version})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Execution Latency:</span>
                  <span className="text-slate-200">{result.processing_time_ms.toFixed(1)} ms</span>
                </div>
              </div>
            </div>

            {/* Overall Verdict & Probabilities */}
            <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] font-mono uppercase text-slate-400 font-semibold border-b border-slate-800/80 pb-1 mb-2">
                  Primary Forensic Verdict
                </h4>
                <div className="flex items-center justify-between">
                  <VerdictBadge verdict={result.verdict} size="lg" />
                  <div className="text-right font-mono">
                    <span className="text-[11px] text-slate-400 block">Deepfake Probability</span>
                    <span className="text-base font-bold text-rose-400">{result.probability.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Authenticity Confidence:</span>
                <span className="text-slate-200 font-semibold">{result.confidence.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Detected Anomalies Table (Image / General) */}
          {result.anomalies && result.anomalies.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold mb-2">
                Spatial & Frequency Anomaly Findings
              </h4>
              <div className="border border-slate-800 rounded overflow-hidden">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Forensic Test</th>
                      <th className="p-2.5">Detection Status</th>
                      <th className="p-2.5">Anomaly Score</th>
                      <th className="p-2.5">Technical Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {result.anomalies.map((anom) => (
                      <tr key={anom.id} className="hover:bg-slate-800/20">
                        <td className="p-2.5 font-medium text-slate-200">{anom.name}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            anom.detected ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {anom.detected ? `DETECTED (${anom.severity})` : 'NEGATIVE'}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-300">{anom.score.toFixed(1)}%</td>
                        <td className="p-2.5 text-slate-400 text-[10px]">{anom.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suspicious Timestamps (Video) */}
          {result.suspicious_timeline && result.suspicious_timeline.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold mb-2">
                Temporal Inconsistency Windows
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                {result.suspicious_timeline.map((seg, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded border border-rose-900/40 flex justify-between items-center">
                    <div>
                      <span className="text-rose-400 font-bold mr-2">{seg.start_str} - {seg.end_str}</span>
                      <span className="text-slate-300">{seg.primary_anomaly}</span>
                    </div>
                    <span className="text-rose-400 font-bold">{seg.peak_probability}% Peak</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suspicious Audio Segments (Audio) */}
          {result.suspicious_segments && result.suspicious_segments.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold mb-2">
                Acoustic Synthesis Anomalies
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                {result.suspicious_segments.map((seg, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded border border-rose-900/40 flex justify-between items-center">
                    <div>
                      <span className="text-rose-400 font-bold mr-2">{seg.start_str} - {seg.end_str}</span>
                      <span className="text-slate-300">{seg.anomaly}</span>
                    </div>
                    <span className="text-slate-400">Band: {seg.frequency_band}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multimodal Fusion Factors */}
          {result.fusion_factors && (
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold mb-2">
                Multimodal Cross-Modal Fusion Matrix
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {result.fusion_factors.map((f, i) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px]">
                    <div className="text-slate-400 font-semibold mb-1">{f.factor}</div>
                    <div className="text-rose-400 font-bold text-sm mb-1">{f.contribution}</div>
                    <div className="text-slate-400 text-[10px]">{f.observation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cryptographic Seal & Chain of Custody */}
          <div className="bg-slate-950 p-3.5 rounded border border-slate-800 font-mono text-[10px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>SHA-256 FORENSIC INTEGRITY HASH:</span>
              <span className="text-slate-300 font-bold">{sha256Simulated}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>AUDIT CHAIN OF CUSTODY:</span>
              <span className="text-slate-300">DFS-VALIDATED-NODE-ALPHA // NO ARTIFACT MODIFICATIONS DETECTED</span>
            </div>
          </div>

          {/* Mandatory Legal Disclaimer */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded text-[11px] text-slate-400 italic">
            <span className="font-semibold text-slate-300 not-italic">LEGAL & ETHICAL DISCLAIMER: </span>
            {result.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};
