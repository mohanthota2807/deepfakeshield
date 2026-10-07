import React, { useState } from 'react';
import { VideoTimelineSegment, FrameSample } from '../types';

interface VideoTimelineProps {
  durationSec?: number;
  timelineSegments?: VideoTimelineSegment[];
  frames?: FrameSample[];
  onSeek?: (timestampSec: number) => void;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  durationSec = 42.0,
  timelineSegments = [],
  frames = [],
  onSeek
}) => {
  const [activeTime, setActiveTime] = useState<number>(14.8);
  const [selectedFrame, setSelectedFrame] = useState<FrameSample | null>(
    frames.find((f) => f.time_sec === 14.8) || frames[0] || null
  );

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = Math.round(ratio * durationSec * 10) / 10;
    setActiveTime(targetSec);
    if (onSeek) onSeek(targetSec);

    // Pick closest frame
    if (frames.length > 0) {
      const closest = frames.reduce((prev, curr) =>
        Math.abs(curr.time_sec - targetSec) < Math.abs(prev.time_sec - targetSec) ? curr : prev
      );
      setSelectedFrame(closest);
    }
  };

  const handleSelectFrame = (frame: FrameSample) => {
    setSelectedFrame(frame);
    setActiveTime(frame.time_sec);
    if (onSeek) onSeek(frame.time_sec);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Horizontal Interactive Timeline */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold uppercase tracking-wider">
              Temporal Inconsistency Timeline
            </span>
            <span className="text-slate-400 font-normal">
              (Total: {durationSec}s @ 30 FPS)
            </span>
          </div>
          <span className="text-slate-300 font-bold">
            Seek Position: {Math.floor(activeTime / 60).toString().padStart(2, '0')}:
            {(activeTime % 60).toFixed(1).padStart(4, '0')}
          </span>
        </div>

        {/* Timeline Bar Track */}
        <div
          onClick={handleTimelineClick}
          className="relative h-9 w-full bg-slate-950 border border-slate-800 rounded cursor-pointer overflow-hidden select-none"
        >
          {/* Subtle grid ticks */}
          <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-20">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="h-full border-r border-slate-600" />
            ))}
          </div>

          {/* Suspicious Highlight Segments */}
          {timelineSegments.map((seg, idx) => {
            const leftPct = (seg.start_time / durationSec) * 100;
            const widthPct = ((seg.end_time - seg.start_time) / durationSec) * 100;
            return (
              <div
                key={idx}
                className="absolute top-0 bottom-0 bg-rose-500/35 border-x-2 border-rose-500 hover:bg-rose-500/50 transition-colors flex items-center justify-center"
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                title={`${seg.start_str} - ${seg.end_str}: ${seg.primary_anomaly} (${seg.peak_probability}%)`}
              >
                <span className="text-[10px] font-mono font-bold text-rose-300 truncate px-1">
                  {seg.start_str}-{seg.end_str}
                </span>
              </div>
            );
          })}

          {/* Current Scrubber Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-sky-400 pointer-events-none z-10"
            style={{ left: `${(activeTime / durationSec) * 100}%` }}
          >
            <div className="w-2.5 h-2.5 -ml-1 bg-sky-400 rotate-45 transform -mt-1 shadow-sm" />
          </div>
        </div>

        {/* Timestamp Quick Jump Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Suspicious Windows:</span>
          {timelineSegments.map((seg, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTime(seg.start_time);
                if (onSeek) onSeek(seg.start_time);
                const matching = frames.find((f) => f.time_sec >= seg.start_time && f.time_sec <= seg.end_time);
                if (matching) setSelectedFrame(matching);
              }}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/60 font-mono text-[11px] hover:bg-rose-900/50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>
                {seg.start_str} - {seg.end_str}
              </span>
              <span className="text-rose-400 font-bold">({seg.peak_probability}%)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frame-Level Analysis Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Frame-Level Deepfake Analysis
          </h4>
          <span className="text-[11px] text-slate-400">Click frame to inspect</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {frames.map((frame) => {
            const isSelected = selectedFrame?.frame_index === frame.frame_index;
            const isFake = frame.fake_probability >= 70;
            return (
              <div
                key={frame.frame_index}
                onClick={() => handleSelectFrame(frame)}
                className={`p-2 rounded border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-950/20 shadow-sm ring-1 ring-sky-500'
                    : isFake
                    ? 'border-rose-900/60 bg-rose-950/20 hover:border-rose-700'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>{frame.timestamp}</span>
                  <span
                    className={`font-bold ${
                      isFake ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {frame.fake_probability}%
                  </span>
                </div>
                {/* Visual frame preview thumbnail representation */}
                <div className="relative aspect-video rounded bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden mb-1.5">
                  <span className="text-[10px] font-mono text-slate-500">#{frame.frame_index}</span>
                  {isFake && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  Conf: {frame.confidence}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Frame Detail Inspector */}
      {selectedFrame && (
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sky-400 font-semibold">
                Frame #{selectedFrame.frame_index} ({selectedFrame.timestamp})
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                  selectedFrame.fake_probability >= 70
                    ? 'bg-rose-950/60 text-rose-300 border-rose-800/80'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                }`}
              >
                {selectedFrame.verdict}
              </span>
            </div>
            <p className="text-slate-300 text-[11px]">{selectedFrame.notes}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400">Deepfake Prob:</span>{' '}
              <span className="text-rose-400 font-bold">{selectedFrame.fake_probability}%</span>
            </div>
            <div>
              <span className="text-slate-400">Confidence:</span>{' '}
              <span className="text-slate-200 font-bold">{selectedFrame.confidence}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
