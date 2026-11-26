import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'white' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

/** Light sweep across the button on hover (pseudo-element, no extra markup). */
const shine =
  'relative isolate overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:-z-0 before:w-1/3 before:-translate-x-[120%] before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent hover:-translate-y-0.5 hover:before:animate-shine';

const variants: Record<ButtonVariant, string> = {
  primary: `${shine} bg-brand-700 text-white shadow-sm hover:bg-brand-800 hover:shadow-glow focus-visible:ring-brand-500`,
  accent: `${shine} bg-accent-400 text-brand-950 shadow-glow-accent hover:bg-accent-300 focus-visible:ring-accent-400`,
  outline:
    'border border-slate-300 bg-white text-ink hover:border-brand-600 hover:text-brand-800 focus-visible:ring-brand-500',
  ghost: 'text-ink hover:bg-slate-100 focus-visible:ring-brand-500',
  white: 'bg-white text-brand-900 shadow-sm hover:bg-brand-50 focus-visible:ring-white',
  glass:
    'border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:ring-white/70 focus-visible:ring-offset-brand-950',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-[3.25rem] px-7 text-base',
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}
