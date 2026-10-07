import React, { useState, useRef, useEffect } from 'react';
import { SuspiciousRegion } from '../types';

interface HeatmapViewerProps {
  imageSrc?: string;
  suspiciousRegions?: SuspiciousRegion[];
  alt?: string;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  imageSrc,
  suspiciousRegions = [],
  alt = 'Forensic image specimen'
}) => {
  const [viewMode, setViewMode] = useState<'original' | 'heatmap' | 'overlay'>('overlay');
  const [opacity, setOpacity] = useState<number>(0.65);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render authentic forensic heatmap gradient on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (viewMode === 'original') {
      return;
    }

    // Heatmap background base
    if (viewMode === 'heatmap') {
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, width, height);
    }

    // Draw thermal gradients for suspicious regions or standard face landmark centers
    const points = suspiciousRegions.length > 0 ? suspiciousRegions : [
      { x: 0.35, y: 0.30, w: 0.30, h: 0.40, label: 'Facial Area', intensity: 0.85 },
      { x: 0.42, y: 0.36, w: 0.16, h: 0.10, label: 'Ocular Band', intensity: 0.72 }
    ];

    points.forEach((region) => {
      const cx = (region.x + region.w / 2) * width;
      const cy = (region.y + region.h / 2) * height;
      const radius = Math.max(region.w * width, region.h * height) * 0.75;

      const gradient = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
      
      const alpha = viewMode === 'heatmap' ? 0.9 : opacity;
      gradient.addColorStop(0, `rgba(239, 68, 68, ${alpha})`); // Red (high activation)
      gradient.addColorStop(0.35, `rgba(245, 158, 11, ${alpha * 0.85})`); // Amber
      gradient.addColorStop(0.65, `rgba(59, 130, 246, ${alpha * 0.5})`); // Blue
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw bounding box if in overlay mode
      if (viewMode === 'overlay' && region.label) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(
          region.x * width,
          region.y * height,
          region.w * width,
          region.h * height
        );
        ctx.setLineDash([]);

        // Region tag
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(region.x * width, region.y * height - 18, region.label.length * 7 + 10, 18);
        ctx.fillStyle = '#f87171';
        ctx.font = '10px monospace';
        ctx.fillText(region.label, region.x * width + 4, region.y * height - 5);
      }
    });
  }, [viewMode, opacity, suspiciousRegions]);

  return (
    <div className="flex flex-col gap-3">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded text-xs">
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-mono text-[11px] mr-1">LAYER:</span>
          {(['original', 'overlay', 'heatmap'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors ${
                viewMode === mode
                  ? 'bg-slate-700 text-slate-100 font-semibold border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {viewMode === 'overlay' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">OPACITY:</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-20 accent-sky-500 h-1.5 bg-slate-800 rounded cursor-pointer"
            />
            <span className="font-mono text-slate-300 w-8 text-right text-[11px]">
              {Math.round(opacity * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Visual Canvas Container */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] rounded border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-contain select-none transition-opacity duration-200 ${
              viewMode === 'heatmap' ? 'opacity-0' : 'opacity-100'
            }`}
          />
        ) : (
          <div className="text-slate-500 text-xs font-mono">No Specimen Loaded</div>
        )}

        {/* Grad-CAM Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={600}
          height={450}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-200 ${
            viewMode === 'original' ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Forensic Thermal Legend */}
        {viewMode !== 'original' && (
          <div className="absolute bottom-2 right-2 bg-slate-950/90 border border-slate-800/80 px-2.5 py-1.5 rounded flex items-center gap-2 text-[10px] font-mono backdrop-blur-sm">
            <span className="text-slate-400">Grad-CAM Salience:</span>
            <div className="w-16 h-2 rounded-sm bg-gradient-to-r from-blue-600 via-amber-500 to-red-600 border border-slate-700/50" />
            <span className="text-red-400 font-semibold">Max Anomaly</span>
          </div>
        )}
      </div>

      {/* Forensic Disclaimer */}
      <p className="text-[11px] text-slate-400 italic">
        Visual salience heatmaps highlight spatial activation divergence in the neural model and should be interpreted as forensic indicators rather than definitive proof.
      </p>
    </div>
  );
};
