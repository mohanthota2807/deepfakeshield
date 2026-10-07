import React from 'react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 sm:pt-10 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-800 bg-slate-900/80 text-slate-300 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>Multimodal Digital Media Forensics Protocol</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-100 font-mono">
          Detect What Isn't Real.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto">
          DeepFakeShield uses multimodal AI to analyze images, videos, and audio for signs of manipulation and synthetic generation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            Analyze Media
          </button>
          <a
            href="#how-it-works"
            className="px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Explore How It Works
          </a>
        </div>

        <div className="pt-4 flex items-center justify-center gap-6 text-slate-400 text-xs font-mono">
          <span>• Images (JPG, PNG, WEBP)</span>
          <span>• Videos (MP4, MOV, WEBM)</span>
          <span>• Audio (WAV, MP3, FLAC)</span>
        </div>
      </section>

      {/* Forensic Modality Grid */}
      <section className="space-y-4 px-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Forensic Inspection Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Image Forensics */}
          <div
            onClick={() => onNavigate('image')}
            className="p-5 rounded border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 mb-3 group-hover:border-sky-500/50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-mono text-sm font-semibold text-slate-200 mb-1">
              Image Forensics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects spatial blending seams, generative upsampling artifacts, corneal reflection asymmetry, and compression noise residuals via Grad-CAM backpropagation.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sky-400 text-xs font-mono group-hover:underline">
              <span>Launch Image Analyzer</span>
              <span>→</span>
            </div>
          </div>

          {/* Video Forensics */}
          <div
            onClick={() => onNavigate('video')}
            className="p-5 rounded border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 mb-3 group-hover:border-sky-500/50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-mono text-sm font-semibold text-slate-200 mb-1">
              Video Forensics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts facial crops across temporal sequences to pinpoint inter-frame jitter, identity swapping flicker, and anomalous blinking dynamics with scrubber timeline.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sky-400 text-xs font-mono group-hover:underline">
              <span>Launch Video Analyzer</span>
              <span>→</span>
            </div>
          </div>

          {/* Audio Forensics */}
          <div
            onClick={() => onNavigate('audio')}
            className="p-5 rounded border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 mb-3 group-hover:border-sky-500/50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="font-mono text-sm font-semibold text-slate-200 mb-1">
              Audio Forensics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes Log-Mel spectrograms, vocoder phase cancellation, synthetic silence gaps, and unnatural acoustic formant stability characteristic of voice cloning models.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sky-400 text-xs font-mono group-hover:underline">
              <span>Launch Audio Analyzer</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="space-y-6 px-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Forensic Pipeline & Methodology
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded border border-slate-800 bg-slate-900/50 space-y-2">
            <span className="font-mono text-xs font-bold text-sky-400">01 // INGESTION</span>
            <h4 className="font-mono text-xs font-semibold text-slate-200">Integrity & Preprocessing</h4>
            <p className="text-[11px] text-slate-400">
              Calculates SHA-256 evidence hashes, validates container streams, normalizes colourspaces, and resamples acoustic waveforms.
            </p>
          </div>

          <div className="p-4 rounded border border-slate-800 bg-slate-900/50 space-y-2">
            <span className="font-mono text-xs font-bold text-sky-400">02 // DECOMPOSITION</span>
            <h4 className="font-mono text-xs font-semibold text-slate-200">Feature Extraction</h4>
            <p className="text-[11px] text-slate-400">
              Extracts 5-point facial landmark matrices, PRNU sensor noise residuals, DCT frequency coefficients, and Log-Mel acoustic banks.
            </p>
          </div>

          <div className="p-4 rounded border border-slate-800 bg-slate-900/50 space-y-2">
            <span className="font-mono text-xs font-bold text-sky-400">03 // INFERENCE</span>
            <h4 className="font-mono text-xs font-semibold text-slate-200">Neural Verification</h4>
            <p className="text-[11px] text-slate-400">
              Evaluates spatial ViT attention, Bi-LSTM temporal coherency, and AASIST graph network classifiers against synthetic artifacts.
            </p>
          </div>

          <div className="p-4 rounded border border-slate-800 bg-slate-900/50 space-y-2">
            <span className="font-mono text-xs font-bold text-sky-400">04 // EXPLAINABILITY</span>
            <h4 className="font-mono text-xs font-semibold text-slate-200">Audit & Attribution</h4>
            <p className="text-[11px] text-slate-400">
              Generates Grad-CAM visual heatmaps, localized suspicious timestamps, and exportable tamper-evident forensic reports.
            </p>
          </div>
        </div>
      </section>

      {/* Digital Forensics Compliance Banner */}
      <section className="px-4">
        <div className="p-5 rounded border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-200">
                Evidence Integrity & Chain of Custody
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                NIST SP 800-86
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              All intake operations retain cryptographic hash verifications. Raw media is evaluated in memory and discarded without unauthorized retention.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 transition-colors shrink-0"
          >
            Open Console
          </button>
        </div>
      </section>
    </div>
  );
};
