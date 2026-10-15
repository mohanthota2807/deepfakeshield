import React, { useState, useRef } from 'react';
import { MediaType } from '../types';

interface MediaUploaderProps {
  mediaType: MediaType;
  accept: string;
  maxSizeMb: number;
  onFileSelect: (file: File) => void;
  onSelectSample?: (sampleKey: string) => void;
  selectedFile?: File | null;
  sampleOptions?: Array<{ key: string; label: string; badge: string }>;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  mediaType,
  accept,
  maxSizeMb,
  onFileSelect,
  onSelectSample,
  selectedFile,
  sampleOptions = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateAndHandle = (file: File) => {
    setErrorMsg(null);
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > maxSizeMb) {
      setErrorMsg(`File size (${sizeMb.toFixed(1)} MB) exceeds maximum allowed limit of ${maxSizeMb} MB.`);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-sky-500 bg-sky-950/20'
            : selectedFile
            ? 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndHandle(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
            {mediaType === 'image' && (
              <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {mediaType === 'video' && (
              <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            {mediaType === 'audio' && (
              <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
            {mediaType === 'multimodal' && (
              <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            )}
          </div>

          {selectedFile ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-xs font-mono text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-200">
                Drag and drop your {mediaType} file here, or{' '}
                <span className="text-sky-400 font-semibold underline underline-offset-2">browse files</span>
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Supported: {accept.replace(/\./g, '').toUpperCase()} • Maximum file size: {maxSizeMb} MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-2.5 rounded bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sample / Test Bench Benchmarks */}
      {sampleOptions.length > 0 && onSelectSample && (
        <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">LOAD BENCHMARK SPECIMEN:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {sampleOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSample(opt.key);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 font-mono text-[11px] transition-colors flex items-center gap-1.5"
              >
                <span>{opt.label}</span>
                <span className={`text-[9px] px-1 rounded uppercase font-bold ${
                  opt.badge === 'Deepfake' ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
