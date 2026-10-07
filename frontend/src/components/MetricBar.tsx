import React from 'react';

interface MetricBarProps {
  label: string;
  value: number; // 0 to 100
  secondaryLabel?: string;
  variant?: 'danger' | 'success' | 'warning' | 'info' | 'default';
  showPercent?: boolean;
}

export const MetricBar: React.FC<MetricBarProps> = ({
  label,
  value,
  secondaryLabel,
  variant = 'default',
  showPercent = true
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);

  const getBarColor = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-500';
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
        return 'bg-sky-500';
      default:
        return clamped >= 70 ? 'bg-rose-500' : clamped <= 35 ? 'bg-emerald-500' : 'bg-amber-500';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
        <span className="flex items-center gap-1.5">
          <span>{label}</span>
          {secondaryLabel && (
            <span className="text-slate-400 font-normal">({secondaryLabel})</span>
          )}
        </span>
        {showPercent && (
          <span className="font-mono text-sm font-semibold text-slate-100">
            {clamped.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-sm bg-slate-800 border border-slate-700/60">
        <div
          className={`h-full transition-all duration-500 ease-out ${getBarColor()}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
