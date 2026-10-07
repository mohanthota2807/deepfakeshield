import React from 'react';
import { ForensicVerdict } from '../types';

interface VerdictBadgeProps {
  verdict: ForensicVerdict;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  size = 'md',
  showIcon = true
}) => {
  let bg = '';
  let text = '';
  let border = '';
  let label = verdict;
  let icon = null;

  if (verdict === 'AUTHENTIC') {
    bg = 'bg-emerald-950/40';
    text = 'text-emerald-400';
    border = 'border-emerald-800/60';
    label = 'AUTHENTIC';
    icon = (
      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  } else if (verdict === 'DEEPFAKE' || verdict === 'AI-GENERATED') {
    bg = 'bg-rose-950/40';
    text = 'text-rose-400';
    border = 'border-rose-800/60';
    label = verdict === 'AI-GENERATED' ? 'AI-GENERATED' : 'DEEPFAKE DETECTED';
    icon = (
      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  } else {
    bg = 'bg-amber-950/40';
    text = 'text-amber-400';
    border = 'border-amber-800/60';
    label = 'UNCERTAIN';
    icon = (
      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs font-semibold px-3 py-1',
    lg: 'text-sm font-semibold px-3.5 py-1.5 tracking-wider'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono ${bg} ${text} ${border} ${sizeClasses} select-none`}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};
