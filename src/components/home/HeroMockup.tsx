import { BadgeCheck, CalendarCheck, HandCoins, MapPin, ShieldCheck, Star } from 'lucide-react';

import { useContent } from '@/content';

/**
 * Decorative product preview in the hero (hidden from assistive tech).
 * Floating cards sit in the wrapper's top/bottom padding and only overlap the
 * main card's padded edge, so they never cover its content.
 */
export function HeroMockup() {
  const { home } = useContent();
  const m = home.mockup;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[30rem] select-none pb-12 pt-10 lg:me-0"
    >
      <div className="absolute inset-x-6 inset-y-16 -z-10 animate-blob rounded-[2.5rem] bg-gradient-to-tr from-brand-500/40 to-accent-400/30 blur-2xl" />

      {/* Worker profile card */}
      <div className="relative animate-scale-in rounded-[2rem] border border-white/15 bg-white p-6 shadow-lift transition-transform duration-500 [animation-delay:250ms] hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-xl font-extrabold text-white">
              MB
            </div>
            <span className="absolute -bottom-1 -end-1 grid h-6 w-6 place-items-center rounded-full bg-white">
              <span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-3.5 w-3.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-bold text-ink">{m.workerName}</p>
            <p className="truncate text-sm text-ink-muted">{m.workerRole}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm">
              <span className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
                ))}
              </span>
              <span className="ms-1 font-semibold text-ink" dir="ltr">
                4.9
              </span>
              <span className="text-ink-muted">· {m.jobs}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-inset ring-brand-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            {m.verified}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700 ring-1 ring-inset ring-accent-200">
            <BadgeCheck className="h-3.5 w-3.5" />
            {m.tevta}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200/70 rounded-2xl bg-slate-50 py-3 text-center rtl:divide-x-reverse">
          {[
            { value: '4.9★', label: 'Rating' },
            { value: '120+', label: 'Jobs' },
            { value: '7y', label: 'Exp.' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-lg font-extrabold text-ink" dir="ltr">
                {stat.value}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-4 w-4 shrink-0 text-brand-600" />
            <span className="truncate">Gulberg, Lahore</span>
          </p>
          <span className="shrink-0 animate-soft-pulse rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white">
            {m.hire}
          </span>
        </div>
      </div>

      {/* Floating tag: booking confirmed (top, end side). Compact pill, kept inside the column. */}
      <div className="absolute end-3 top-0 animate-fade-up [animation-delay:700ms]">
        <div className="flex animate-float items-center gap-2.5 rounded-full bg-white py-2 pe-4 ps-2 shadow-lift ring-1 ring-slate-900/5">
          <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
            <CalendarCheck className="h-4 w-4" />
            <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-400 ring-2 ring-white" />
          </span>
          <div className="leading-tight">
            <p className="whitespace-nowrap text-[13px] font-semibold text-ink">{m.bookingTitle}</p>
            <p className="whitespace-nowrap text-[11px] text-ink-muted">{m.bookingBody}</p>
          </div>
        </div>
      </div>

      {/* Floating tag: earnings split (bottom, start side) */}
      <div className="absolute bottom-0 start-3 animate-fade-up [animation-delay:950ms]">
        <div className="flex animate-float-slow items-center gap-2.5 rounded-full bg-white py-2 pe-4 ps-2 shadow-lift ring-1 ring-slate-900/5 [animation-delay:1.5s]">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-400 text-brand-950">
            <HandCoins className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="whitespace-nowrap text-[13px] font-semibold text-ink">
              {m.earningsTitle}
            </p>
            <div
              className="mt-1 flex h-1.5 w-28 overflow-hidden rounded-full bg-accent-400"
              dir="ltr"
            >
              <div className="w-[90%] origin-left animate-grow-x rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
