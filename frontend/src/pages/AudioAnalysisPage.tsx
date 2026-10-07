import React, { useState } from 'react';
import { ForensicAnalysisResult } from '../types';
import { MediaUploader } from '../components/MediaUploader';
import { AudioSpectrogram } from '../components/AudioSpectrogram';
import { VerdictBadge } from '../components/VerdictBadge';
import { MetricBar } from '../components/MetricBar';
import { analyzeAudioApi } from '../services/api';
import { sampleDemonstrations } from '../services/forensicEngine';

interface AudioAnalysisPageProps {
  onViewReport: (result: ForensicAnalysisResult) => void;
  isDemoMode: boolean;
}

export const AudioAnalysisPage: React.FC<AudioAnalysisPageProps> = ({
  onViewReport,
  isDemoMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleOptions = [
    { key: 'cloned_voice', label: 'Cloned Voice Sample', badge: 'Deepfake' },
    { key: 'authentic_human', label: 'Recorded Human Voice', badge: 'Authentic' }
  ];

  const handleSelectSample = (key: string) => {
    setError(null);
    if (key === 'cloned_voice') {
      const demo = sampleDemonstrations.audio_cloned;
      setAnalysisResult({
        ...demo,
        id: `dfs-sample-aud-${Date.now()}`
      });
      setAudioUrl('sample_cloned_voice.wav');
    } else {
      setAnalysisResult({
        ...sampleDemonstrations.audio_cloned,
        id: `dfs-sample-aud-${Date.now()}`,
        filename: 'authentic_human_interview.wav',
        verdict: 'AUTHENTIC',
        probability: 5.4,
        confidence: 94.8,
        suspicious_segments: []
      });
      setAudioUrl('sample_authentic_voice.wav');
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    setSelectedFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const runAnalysis = async () => {
    if (!selectedFile && !audioUrl) return;
    setIsProcessing(true);
    setError(null);

    const stages = [
      'Resampling waveform to 16kHz & normalising peak amplitude...',
      'Computing 64-bank Log-Mel Spectrogram & CQT features...',
      'Executing AASIST Graph Neural Network...',
      'Inspecting vocoder phase continuity & spectral truncation...',
      'Mapping segment-level synthetic acoustic probability...'
    ];

    let idx = 0;
    setProcessingStage(stages[0]);
    const timer = setInterval(() => {
      idx++;
      if (idx < stages.length) {
        setProcessingStage(stages[idx]);
      }
    }, 380);

    try {
      let fileToAnalyze = selectedFile;
      if (!fileToAnalyze) {
        fileToAnalyze = new File(['mock_audio'], 'sample_audio_specimen.wav', { type: 'audio/wav' });
      }

      const res = await analyzeAudioApi(fileToAnalyze, isDemoMode);
      clearInterval(timer);
      setAnalysisResult(res);
    } catch (err) {
      clearInterval(timer);
      setError("Analysis couldn't be completed. Audio spectrogram model is temporarily offline.");
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
          Audio Forensics & Voice Synthesis Detection
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Frequency-domain Log-Mel spectrogram inspection, vocoder phase continuity analysis, and acoustic formant verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Audio Playback Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Acoustic Specimen Intake</span>
              {analysisResult?.is_demo && (
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded">
                  DEMO RESULT
                </span>
              )}
            </h2>

            {/* Audio Player Container */}
            <div className="p-4 rounded border border-slate-800 bg-slate-950 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>

              {selectedFile && audioUrl ? (
                <audio src={audioUrl} controls className="w-full" />
              ) : audioUrl ? (
                <div className="text-center">
                  <span className="text-xs font-mono text-slate-300 font-semibold block">
                    {analysisResult?.filename || 'synthesized_voice_cloning.wav'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Acoustic buffer ready for spectrogram extraction
                  </span>
                </div>
              ) : (
                <span className="text-xs font-mono text-slate-500">
                  No audio specimen loaded
                </span>
              )}
            </div>
          </div>

          <MediaUploader
            mediaType="audio"
            accept=".mp3,.wav,.m4a,.flac"
            maxSizeMb={50}
            onFileSelect={handleFileSelect}
            onSelectSample={handleSelectSample}
            selectedFile={selectedFile}
            sampleOptions={sampleOptions}
          />
        </div>

        {/* Results & Spectrogram / Waveform Viewer */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Acoustic Forensic Engine
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Model: AASIST + RawNet2
              </span>
            </div>

            <button
              onClick={runAnalysis}
              disabled={isProcessing || (!selectedFile && !audioUrl)}
              className={`w-full py-2.5 rounded font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isProcessing || (!selectedFile && !audioUrl)
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
                  <span>{processingStage || 'Processing Audio Pipeline...'}</span>
                </>
              ) : (
                <span>Analyze Audio Specimen</span>
              )}
            </button>

            {error && (
              <div className="p-3 rounded bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Results Display */}
          {analysisResult && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Acoustic Synthesis Classification
                  </span>
                  <VerdictBadge verdict={analysisResult.verdict} size="lg" />
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">AI-Generated Probability</span>
                  <span className="text-lg font-bold text-rose-400">
                    {analysisResult.probability.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <MetricBar
                  label="Synthetic Voice Probability"
                  value={analysisResult.probability}
                  variant="danger"
                />
                <MetricBar
                  label="Acoustic Confidence"
                  value={analysisResult.confidence}
                  variant="info"
                />
              </div>

              {/* Waveform and Mel Spectrogram Visualizer (Section 13 & 14) */}
              <AudioSpectrogram
                durationSec={analysisResult.metadata?.duration_sec || 18.5}
                sampleRateHz={analysisResult.metadata?.sample_rate_hz || 44100}
                channels={analysisResult.metadata?.channels || 2}
                suspiciousSegments={analysisResult.suspicious_segments || []}
                acousticFeatures={analysisResult.acoustic_features || []}
              />

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => onViewReport(analysisResult)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Forensic Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
