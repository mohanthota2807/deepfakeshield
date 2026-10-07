import React, { useRef, useEffect } from 'react';
import { AudioSegment, AcousticFeature } from '../types';

interface AudioSpectrogramProps {
  durationSec?: number;
  sampleRateHz?: number;
  channels?: number;
  suspiciousSegments?: AudioSegment[];
  acousticFeatures?: AcousticFeature[];
}

export const AudioSpectrogram: React.FC<AudioSpectrogramProps> = ({
  durationSec = 18.5,
  sampleRateHz = 44100,
  channels = 2,
  suspiciousSegments = [],
  acousticFeatures = []
}) => {
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrogramCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render forensic waveform on canvas
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Centerline
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Generate realistic acoustic waveform bars
    const barCount = 120;
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
      const timeSec = (i / barCount) * durationSec;
      // Check if timeSec falls inside suspicious segment
      const isSuspicious = suspiciousSegments.some(
        (seg) => timeSec >= seg.start_time && timeSec <= seg.end_time
      );

      // Acoustic envelope simulation
      const baseAmp = Math.sin(i * 0.15) * 0.35 + Math.cos(i * 0.42) * 0.25;
      const noise = (Math.sin(i * 3.7) + 1) * 0.15;
      const amp = Math.max(0.05, Math.min(0.9, Math.abs(baseAmp + noise)));
      const barHeight = amp * (height * 0.75);

      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      ctx.fillStyle = isSuspicious ? '#f43f5e' : '#38bdf8';
      ctx.fillRect(x + 1, y, Math.max(1, barWidth - 2), barHeight);
    }
  }, [durationSec, suspiciousSegments]);

  // Render Log-Mel Spectrogram (heat distribution across frequency bins 0 - 8kHz)
  useEffect(() => {
    const canvas = spectrogramCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, width, height);

    const timeSteps = 80;
    const freqBins = 32;
    const cellW = width / timeSteps;
    const cellH = height / freqBins;

    for (let t = 0; t < timeSteps; t++) {
      const timeSec = (t / timeSteps) * durationSec;
      const isSuspicious = suspiciousSegments.some(
        (seg) => timeSec >= seg.start_time && timeSec <= seg.end_time
      );

      for (let f = 0; f < freqBins; f++) {
        // High frequencies on top, low on bottom
        const freqNorm = 1 - f / freqBins;
        let energy = Math.sin(t * 0.2 + f * 0.4) * 0.5 + 0.5;

        // Artificial synthesis often lacks high frequency organic dispersion
        if (freqNorm > 0.7 && isSuspicious) {
          energy *= 0.15; // unnatural frequency truncation cutoff!
        } else if (isSuspicious && freqNorm > 0.3 && freqNorm < 0.6) {
          energy = Math.min(1.0, energy * 1.5); // vocoder phase spike
        }

        // Color mapper: black -> purple -> red -> yellow -> white
        let color = '#090d16';
        if (energy > 0.8) color = '#fef08a';
        else if (energy > 0.6) color = '#f97316';
        else if (energy > 0.4) color = '#dc2626';
        else if (energy > 0.2) color = '#7c3aed';
        else if (energy > 0.05) color = '#1e1b4b';

        ctx.fillStyle = color;
        ctx.fillRect(t * cellW, f * cellH, cellW + 0.5, cellH + 0.5);
      }
    }
  }, [durationSec, suspiciousSegments]);

  return (
    <div className="flex flex-col gap-4">
      {/* Audio Metadata Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-2 rounded">
          <span className="text-slate-400 block text-[10px]">DURATION</span>
          <span className="text-slate-100 font-semibold">{durationSec}s</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-2 rounded">
          <span className="text-slate-400 block text-[10px]">SAMPLE RATE</span>
          <span className="text-slate-100 font-semibold">{sampleRateHz.toLocaleString()} Hz</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-2 rounded">
          <span className="text-slate-400 block text-[10px]">CHANNELS</span>
          <span className="text-slate-100 font-semibold">{channels === 1 ? 'Mono (1ch)' : 'Stereo (2ch)'}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-2 rounded">
          <span className="text-slate-400 block text-[10px]">ACOUSTIC MODEL</span>
          <span className="text-slate-100 font-semibold truncate">AASIST Log-Mel</span>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
          <span>Acoustic Amplitude Waveform</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-sky-400">
              <span className="w-2 h-2 rounded-sm bg-sky-400" /> Natural Formant
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-sm bg-rose-500" /> Synthesized Anomaly
            </span>
          </div>
        </div>
        <div className="relative h-20 w-full rounded overflow-hidden border border-slate-800 bg-slate-950">
          <canvas
            ref={waveformCanvasRef}
            width={700}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Log-Mel Spectrogram Visualization */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
          <span>Log-Mel Spectrogram (Frequency vs Time)</span>
          <span className="text-slate-400 text-[11px]">0 Hz - 8,000 Hz Bandwidth</span>
        </div>
        <div className="relative h-32 w-full rounded overflow-hidden border border-slate-800 bg-slate-950">
          <canvas
            ref={spectrogramCanvasRef}
            width={700}
            height={130}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">8.0 kHz</div>
          <div className="absolute top-1/2 left-2 text-[9px] font-mono text-slate-400">4.0 kHz</div>
          <div className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-400">0 Hz</div>
        </div>
      </div>

      {/* Flagged Suspicious Segments */}
      {suspiciousSegments.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400 mb-2">
            Flagged Synthetic Audio Segments
          </h4>
          <div className="space-y-2">
            {suspiciousSegments.map((seg, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-rose-900/40 p-2.5 rounded text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-300 font-bold">
                      {seg.start_str} - {seg.end_str}
                    </span>
                    <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                      Band: {seg.frequency_band}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">{seg.anomaly}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Synthesis Prob</span>
                  <span className="text-rose-400 font-mono font-bold text-sm">
                    {seg.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acoustic Forensic Measurements */}
      {acousticFeatures.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Acoustic Forensic Metrics
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2 font-normal">Metric</th>
                  <th className="pb-2 font-normal">Measured Value</th>
                  <th className="pb-2 font-normal">Biological Norm</th>
                  <th className="pb-2 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {acousticFeatures.map((feat, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-2 text-slate-200">{feat.metric}</td>
                    <td className="py-2 text-rose-400">{feat.value}</td>
                    <td className="py-2 text-slate-400">{feat.benchmark}</td>
                    <td className="py-2 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950/60 text-rose-300 border border-rose-800/60">
                        {feat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
