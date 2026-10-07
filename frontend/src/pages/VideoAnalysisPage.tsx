import React, { useState } from 'react';
import { ForensicAnalysisResult } from '../types';
import { MediaUploader } from '../components/MediaUploader';
import { VideoTimeline } from '../components/VideoTimeline';
import { VerdictBadge } from '../components/VerdictBadge';
import { MetricBar } from '../components/MetricBar';
import { analyzeVideoApi } from '../services/api';
import { sampleDemonstrations } from '../services/forensicEngine';

interface VideoAnalysisPageProps {
  onViewReport: (result: ForensicAnalysisResult) => void;
  isDemoMode: boolean;
}

export const VideoAnalysisPage: React.FC<VideoAnalysisPageProps> = ({
  onViewReport,
  isDemoMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(14.8);

  const sampleOptions = [
    { key: 'deepfake_speech', label: 'Face Swap Video Stream', badge: 'Deepfake' },
    { key: 'authentic_stream', label: 'Recorded Video', badge: 'Authentic' }
  ];

  const handleSelectSample = (key: string) => {
    setError(null);
    if (key === 'deepfake_speech') {
      const demo = sampleDemonstrations.video_deepfake;
      setAnalysisResult({
        ...demo,
        id: `dfs-sample-vid-${Date.now()}`
      });
      setVideoPreviewUrl('sample_deepfake_video');
    } else {
      setAnalysisResult({
        ...sampleDemonstrations.video_deepfake,
        id: `dfs-sample-vid-${Date.now()}`,
        filename: 'authentic_broadcast_capture.mp4',
        verdict: 'AUTHENTIC',
        probability: 6.8,
        confidence: 93.4,
        suspicious_timeline: []
      });
      setVideoPreviewUrl('sample_authentic_video');
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    setSelectedFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const runAnalysis = async () => {
    if (!selectedFile && !videoPreviewUrl) return;
    setIsProcessing(true);
    setError(null);

    const stages = [
      'Extracting video frames (30 FPS)...',
      'Running RetinaFace landmark detection...',
      'Aligning normalized facial crops...',
      'Running spatial deepfake backbone (ViT)...',
      'Executing Bi-LSTM temporal coherency pass...',
      'Aggregating windowed Bayesian predictions...'
    ];

    let idx = 0;
    setProcessingStage(stages[0]);
    const timer = setInterval(() => {
      idx++;
      if (idx < stages.length) {
        setProcessingStage(stages[idx]);
      }
    }, 400);

    try {
      let fileToAnalyze = selectedFile;
      if (!fileToAnalyze) {
        fileToAnalyze = new File(['mock_video'], 'sample_forensic_video.mp4', { type: 'video/mp4' });
      }

      const res = await analyzeVideoApi(fileToAnalyze, isDemoMode);
      clearInterval(timer);
      setAnalysisResult(res);
    } catch (err) {
      clearInterval(timer);
      setError("Analysis couldn't be completed. The video inference pipeline encountered a service timeout.");
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
          Video Forensics Pipeline
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Spatiotemporal facial boundary tracking, inter-frame temporal jitter evaluation, and timestamped anomaly scrubbing.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Preview & File Specifications */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Video Evidence Feed</span>
              {analysisResult?.is_demo && (
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded">
                  DEMO RESULT
                </span>
              )}
            </h2>

            {/* Video container */}
            <div className="relative aspect-video rounded border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
              {selectedFile && videoPreviewUrl ? (
                <video
                  src={videoPreviewUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : videoPreviewUrl ? (
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono text-slate-300 font-semibold">
                    Specimen: {analysisResult?.filename || 'video_stream.mp4'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 mt-1">
                    Seek: {currentTimeSec.toFixed(1)}s / 42.0s (RetinaFace Face Track Active)
                  </span>
                </div>
              ) : (
                <div className="text-slate-500 text-xs font-mono text-center p-4">
                  No video loaded. Upload MP4/MOV or choose sample specimen.
                </div>
              )}
            </div>

            {/* Video metadata specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">DURATION</span>
                <span className="text-slate-200 font-semibold">
                  {analysisResult?.metadata?.duration_sec || '42.0'}s
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">FPS</span>
                <span className="text-slate-200 font-semibold">
                  {analysisResult?.metadata?.fps || '30.0'}
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">RESOLUTION</span>
                <span className="text-slate-200 font-semibold">1080p FHD</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">CONTAINER</span>
                <span className="text-slate-200 font-semibold">H.264 / AVC</span>
              </div>
            </div>
          </div>

          <MediaUploader
            mediaType="video"
            accept=".mp4,.mov,.avi,.webm"
            maxSizeMb={150}
            onFileSelect={handleFileSelect}
            onSelectSample={handleSelectSample}
            selectedFile={selectedFile}
            sampleOptions={sampleOptions}
          />
        </div>

        {/* Video Results, Pipeline & Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Card */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Execution Pipeline
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Pipeline: SpatialViT + Bi-LSTM
              </span>
            </div>

            <button
              onClick={runAnalysis}
              disabled={isProcessing || (!selectedFile && !videoPreviewUrl)}
              className={`w-full py-2.5 rounded font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isProcessing || (!selectedFile && !videoPreviewUrl)
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
                  <span>{processingStage || 'Processing Video Pipeline...'}</span>
                </>
              ) : (
                <span>Analyze Video</span>
              )}
            </button>

            {error && (
              <div className="p-3 rounded bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Results Block */}
          {analysisResult && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
              {/* Verdict header */}
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Overall Spatiotemporal Assessment
                  </span>
                  <VerdictBadge verdict={analysisResult.verdict} size="lg" />
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">Deepfake Probability</span>
                  <span className="text-lg font-bold text-rose-400">
                    {analysisResult.probability.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Confidence bars */}
              <div className="space-y-2.5">
                <MetricBar
                  label="Deepfake Temporal Probability"
                  value={analysisResult.probability}
                  variant="danger"
                />
                <MetricBar
                  label="Temporal Consistency Confidence"
                  value={analysisResult.confidence}
                  variant="info"
                />
              </div>

              {/* Section 10 & 11: Suspicious Timeline & Frame-level analysis */}
              <VideoTimeline
                durationSec={analysisResult.metadata?.duration_sec || 42.0}
                timelineSegments={analysisResult.suspicious_timeline || []}
                frames={analysisResult.frame_samples || []}
                onSeek={(sec) => setCurrentTimeSec(sec)}
              />

              {/* Pipeline Stages Execution Trace (Section 9) */}
              <div className="bg-slate-950/60 p-3 rounded border border-slate-800/80">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Forensic Pipeline Execution Trace
                </h3>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {analysisResult.pipeline_stages?.map((stage, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-800/40 pb-1">
                      <span className="text-slate-300">{stage.stage}</span>
                      <span className="text-slate-500 text-[10px] max-w-xs truncate">{stage.details}</span>
                      <span className="text-emerald-400 text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800">
                        {stage.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Action Button */}
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => onViewReport(analysisResult)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Generate Forensic Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
