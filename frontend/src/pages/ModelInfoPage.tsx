import React, { useState, useEffect } from 'react';
import { ModelCard } from '../types';
import { fetchModelRegistryApi } from '../services/api';

export const ModelInfoPage: React.FC = () => {
  const [models, setModels] = useState<ModelCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelRegistryApi().then((data) => {
      setModels(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
          Forensic Model Registry & Architecture
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Auditable neural network specifications, training corpora, and verified evaluation benchmarks.
        </p>
      </div>

      {/* Compliance Note (Section 19 & 38) */}
      <div className="p-3.5 rounded bg-slate-900 border border-slate-800 flex items-start gap-3">
        <svg className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="space-y-1 text-xs">
          <span className="font-mono font-semibold text-slate-200">
            Scientific Metric Integrity Notice
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            In compliance with forensic research standards, DeepFakeShield only reports empirical benchmarks derived from reproducible evaluation protocols. If a module has not completed peer validation, it is explicitly marked as "Evaluation metrics unavailable — model training required."
          </p>
        </div>
      </div>

      {/* Model Cards Grid */}
      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-slate-500">
          Loading forensic model registry...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-4"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                    {model.media_type} Modality
                  </span>
                  <h3 className="text-sm font-mono font-bold text-slate-100 mt-2">
                    {model.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Version: {model.version} • Status: {model.status}
                  </span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ARCHITECTURE</span>
                    <span className="text-slate-200">{model.architecture}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TRAINING DATASET</span>
                    <span className="text-slate-300">{model.training_dataset}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">INPUT RESOLUTION</span>
                    <span className="text-slate-300">{model.input_resolution}</span>
                  </div>
                </div>

                {/* Validation Metrics (Section 19 & 38) */}
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase font-semibold mb-1">
                    Benchmark Evaluation
                  </span>

                  {model.metrics_available && model.metrics ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">PRECISION</span>
                        <span className="text-xs font-bold text-sky-400">{model.metrics.precision}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">RECALL</span>
                        <span className="text-xs font-bold text-sky-400">{model.metrics.recall}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">F1 SCORE</span>
                        <span className="text-xs font-bold text-sky-400">{model.metrics.f1_score}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">ROC-AUC</span>
                        <span className="text-xs font-bold text-sky-400">{model.metrics.roc_auc}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded bg-amber-950/30 border border-amber-900/60 text-amber-300 text-[11px] font-mono leading-relaxed">
                      ⚠️ {model.evaluation_notice || 'Evaluation metrics unavailable — model training required.'}
                    </div>
                  )}
                </div>

                {/* Explainability methods */}
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold mb-1">
                    Integrated Explainability Methods
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {model.explainability_methods.map((method, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
