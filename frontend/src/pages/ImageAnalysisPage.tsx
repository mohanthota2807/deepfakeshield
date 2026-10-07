import React, { useState } from 'react';
import { ForensicAnalysisResult } from '../types';
import { MediaUploader } from '../components/MediaUploader';
import { HeatmapViewer } from '../components/HeatmapViewer';
import { VerdictBadge } from '../components/VerdictBadge';
import { MetricBar } from '../components/MetricBar';
import { analyzeImageApi } from '../services/api';
import { sampleDemonstrations } from '../services/forensicEngine';

interface ImageAnalysisPageProps {
  onViewReport: (result: ForensicAnalysisResult) => void;
  isDemoMode: boolean;
}

export const ImageAnalysisPage: React.FC<ImageAnalysisPageProps> = ({
  onViewReport,
  isDemoMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleOptions = [
    { key: 'deepfake', label: 'Synthetic GAN Portrait', badge: 'Deepfake' },
    { key: 'authentic', label: 'Uncompressed Photo', badge: 'Authentic' }
  ];

  const handleSelectSample = (sampleKey: string) => {
    setError(null);
    if (sampleKey === 'deepfake') {
      const demo = sampleDemonstrations.image_deepfake;
      setAnalysisResult({
        ...demo,
        id: `dfs-sample-${Date.now()}`,
        preview_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
      });
      setImagePreviewUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');
    } else {
      const demo = sampleDemonstrations.image_authentic;
      setAnalysisResult({
        ...demo,
        id: `dfs-sample-${Date.now()}`,
        preview_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
      });
      setImagePreviewUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80');
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const runAnalysis = async () => {
    if (!selectedFile && !imagePreviewUrl) return;
    setIsProcessing(true);
    setError(null);

    const stages = [
      'Analyzing image...',
      'Extracting visual features...',
      'Running authenticity model...',
      'Generating explanation...'
    ];

    let stageIdx = 0;
    setProcessingStage(stages[0]);
    const stageInterval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setProcessingStage(stages[stageIdx]);
      }
    }, 450);

    try {
      let fileToAnalyze = selectedFile;
      if (!fileToAnalyze) {
        // Fallback for sample photo
        fileToAnalyze = new File(['mock_image'], 'specimen_sample.jpg', { type: 'image/jpeg' });
      }

      const res = await analyzeImageApi(fileToAnalyze, isDemoMode);
      clearInterval(stageInterval);
      setAnalysisResult({
        ...res,
        preview_url: imagePreviewUrl || res.preview_url
      });
    } catch (err: any) {
      clearInterval(stageInterval);
      setError("Analysis couldn't be completed. The model service is temporarily unavailable. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
          Image Forensics Inspection
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          High-resolution spatial artifact analysis, facial boundary consistency, and Grad-CAM salience mapping.
        </p>
      </div>

      {/* Main Analysis Layout: Left preview / Right controls (Section 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Image / Specimen) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
              <span>Specimen Visualizer</span>
              {analysisResult?.is_demo && (
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded">
                  DEMO RESULT
                </span>
              )}
            </h2>

            {imagePreviewUrl ? (
              <HeatmapViewer
                imageSrc={imagePreviewUrl}
                suspiciousRegions={analysisResult?.suspicious_regions || []}
              />
            ) : (
              <div className="aspect-[4/3] rounded border border-slate-800/80 bg-slate-950 flex flex-col items-center justify-center text-slate-500 text-xs font-mono p-6 text-center">
                <svg className="w-10 h-10 text-slate-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Upload an image below or select a benchmark specimen</span>
              </div>
            )}
          </div>

          {/* Upload Component */}
          <MediaUploader
            mediaType="image"
            accept=".jpg,.jpeg,.png,.webp"
            maxSizeMb={20}
            onFileSelect={handleFileSelect}
            onSelectSample={handleSelectSample}
            selectedFile={selectedFile}
            sampleOptions={sampleOptions}
          />
        </div>

        {/* Right Column (Controls & Results) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Analysis Controls Box */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Forensic Engine Controls
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Model: EfficientNet-B4 + ViT
              </span>
            </div>

            <button
              onClick={runAnalysis}
              disabled={isProcessing || (!selectedFile && !imagePreviewUrl)}
              className={`w-full py-2.5 rounded font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isProcessing || (!selectedFile && !imagePreviewUrl)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{processingStage || 'Processing...'}</span>
                </>
              ) : (
                <span>Analyze Image</span>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Analysis Results (Section 6 & 7) */}
          {analysisResult && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-5">
              {/* Primary Verdict & Confidence */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Authenticity Classification
                    </span>
                    <VerdictBadge verdict={analysisResult.verdict} size="lg" />
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block">Processing Latency</span>
                    <span className="text-xs text-slate-300">{analysisResult.processing_time_ms.toFixed(1)} ms</span>
                  </div>
                </div>

                {/* Metrics Bars */}
                <div className="space-y-3 pt-2">
                  <MetricBar
                    label="Deepfake Probability"
                    value={analysisResult.probability}
                    variant="danger"
                  />
                  <MetricBar
                    label="Authenticity Confidence"
                    value={analysisResult.confidence}
                    variant="info"
                  />
                </div>
              </div>

              {/* Explainability Panel (Section 7) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    Why was this prediction made?
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Model Indicators</span>
                </div>

                <div className="space-y-2">
                  {analysisResult.anomalies?.map((anom) => (
                    <div
                      key={anom.id}
                      className="p-2.5 rounded border border-slate-800 bg-slate-950/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-medium text-slate-200">
                          {anom.name}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                            anom.detected
                              ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {anom.detected ? `Anomalous (${anom.severity})` : 'Normal'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{anom.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onViewReport(analysisResult)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download / Share Forensic Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
