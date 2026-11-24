import { Link } from 'react-router-dom';

import { cn } from '@/lib/cn';

interface LogoProps {
  tone?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

/** Brand mark + wordmark. The wordmark stays Latin in both languages (brand name). */
export function Logo({ tone = 'dark', className, onClick }: LogoProps) {
  const light = tone === 'light';
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="ProLinker home"
      className={cn('group inline-flex items-center gap-2.5', className)}
      dir="ltr"
    >
      <span
        className={cn(
          'relative grid h-10 w-10 place-items-center rounded-xl shadow-sm transition-transform duration-300 group-hover:-rotate-6',
          light ? 'bg-white text-brand-800' : 'bg-brand-700 text-white',
        )}
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path
            d="M9 25V7h7.5a6 6 0 0 1 0 12H13v6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full bg-accent-400 ring-2 ring-white" />
      </span>
      <span
        className={cn(
          'font-display text-xl font-extrabold tracking-tight',
          light ? 'text-white' : 'text-ink',
        )}
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
      >
        Pro<span className={light ? 'text-accent-300' : 'text-brand-700'}>Linker</span>
      </span>
    </Link>
  );
}
