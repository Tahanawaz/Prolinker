import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'start';
  tone?: 'light' | 'dark';
  className?: string;
  id?: string;
}

/** Eyebrow + title + description block used at the top of every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className,
  id,
}: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-start',
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]',
            dark ? 'text-accent-300' : 'text-brand-700',
          )}
        >
          <span
            aria-hidden="true"
            className={cn('h-px w-6', dark ? 'bg-accent-300/60' : 'bg-brand-600/50')}
          />
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          'mt-3 text-balance text-3xl font-extrabold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]',
          dark ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-4 text-pretty text-base sm:text-lg',
            dark ? 'text-brand-100/80' : 'text-ink-muted',
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
