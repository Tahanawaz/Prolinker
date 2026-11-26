import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Tone = 'brand' | 'accent' | 'neutral' | 'dark' | 'success';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-800 ring-brand-200',
  accent: 'bg-accent-50 text-accent-700 ring-accent-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  dark: 'bg-white/10 text-brand-100 ring-white/15 backdrop-blur',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

interface BadgeProps {
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'brand', icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
