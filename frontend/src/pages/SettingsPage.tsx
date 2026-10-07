import React, { useState } from 'react';
import { getApiBaseUrl, setApiBaseUrl, checkBackendHealth } from '../services/api';

interface SettingsPageProps {
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  backendOperational: boolean;
  onHealthCheckUpdated: (operational: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDemoMode,
  onToggleDemoMode,
  backendOperational,
  onHealthCheckUpdated
}) => {
  const [apiUrl, setApiUrlState] = useState(getApiBaseUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [sensitivity, setSensitivity] = useState<'conservative' | 'balanced' | 'sensitive'>('balanced');

  const handleSaveApiUrl = () => {
    setApiBaseUrl(apiUrl);
    setTestResult({ success: true, msg: 'API URL updated successfully.' });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const health = await checkBackendHealth();
    setIsTesting(false);
    onHealthCheckUpdated(health.operational);

    if (health.operational) {
      setTestResult({
        success: true,
        msg: `Connected successfully! Response latency: ${health.latencyMs}ms.`
      });
    } else {
      setTestResult({
        success: false,
        msg: 'Connection failed. FastAPI backend is not running at this address (client fallback active).'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
          Forensic System Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Backend endpoint connections, demo simulation modes, and classification sensitivity thresholds.
        </p>
      </div>

      {/* Demo Mode Configuration (Section 33) */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Evaluation Demo Mode
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enables deterministic simulation and synthetic specimen benchmarking without requiring GPU inference servers.
            </p>
          </div>

          <button
            onClick={onToggleDemoMode}
            className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-colors border ${
              isDemoMode
                ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isDemoMode ? 'DEMO MODE: ACTIVE' : 'DEMO MODE: OFF'}
          </button>
        </div>

        <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400">
          <span className="text-amber-400 font-semibold">Forensic Disclosure: </span>
          When active, all predictions and report outputs are distinctly tagged with the{' '}
          <span className="text-amber-300 font-bold">"DEMO RESULT"</span> watermark to uphold legal integrity.
        </div>
      </div>

      {/* Backend API Configuration */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
          FastAPI Backend Service Endpoint
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrlState(e.target.value)}
            placeholder="http://localhost:8000/api"
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={handleSaveApiUrl}
            className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 transition-colors"
          >
            Update URL
          </button>
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            {isTesting ? 'Pinging...' : 'Test Connection'}
          </button>
        </div>

        {testResult && (
          <div
            className={`p-2.5 rounded text-xs font-mono border ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800 text-rose-300'
            }`}
          >
            {testResult.msg}
          </div>
        )}
      </div>

      {/* Forensic Sensitivity Thresholds */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
          Forensic Decision Threshold
        </h3>
        <p className="text-xs text-slate-400">
          Calibrates the probability threshold required before tagging media as an anomalous deepfake.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div
            onClick={() => setSensitivity('conservative')}
            className={`p-3 rounded border cursor-pointer transition-all ${
              sensitivity === 'conservative'
                ? 'border-sky-500 bg-sky-950/20'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="font-mono text-xs font-semibold text-slate-200">Conservative (80%)</div>
            <p className="text-[11px] text-slate-400 mt-1">Minimizes false positives. Requires overwhelming anomaly signals.</p>
          </div>

          <div
            onClick={() => setSensitivity('balanced')}
            className={`p-3 rounded border cursor-pointer transition-all ${
              sensitivity === 'balanced'
                ? 'border-sky-500 bg-sky-950/20'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="font-mono text-xs font-semibold text-slate-200">Balanced (65%)</div>
            <p className="text-[11px] text-slate-400 mt-1">Standard forensic calibration balancing false negatives and precision.</p>
          </div>

          <div
            onClick={() => setSensitivity('sensitive')}
            className={`p-3 rounded border cursor-pointer transition-all ${
              sensitivity === 'sensitive'
                ? 'border-sky-500 bg-sky-950/20'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="font-mono text-xs font-semibold text-slate-200">Sensitive (50%)</div>
            <p className="text-[11px] text-slate-400 mt-1">Maximum detection sensitivity for subtle diffusion and high-compression swaps.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
