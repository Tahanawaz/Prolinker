import { BadgeCheck, CalendarCheck, HandCoins, MapPin, ShieldCheck, Star } from 'lucide-react';

import { useContent } from '@/content';

/** Decorative product preview in the hero (hidden from assistive tech). */
export function HeroMockup() {
  const { home } = useContent();
  const m = home.mockup;

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md select-none lg:max-w-none">
      <div className="absolute inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand-500/40 to-accent-400/30 blur-2xl" />

      {/* Worker profile card */}
      <div className="relative rounded-[2rem] border border-white/15 bg-white p-5 shadow-lift sm:p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-xl font-extrabold text-white">
              MB
            </div>
            <span className="absolute -bottom-1 -end-1 grid h-6 w-6 place-items-center rounded-full bg-white">
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-bold text-ink">{m.workerName}</p>
            <p className="truncate text-sm text-ink-muted">{m.workerRole}</p>
            <div className="mt-1.5 flex items-center gap-1 text-sm">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
              ))}
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

        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50 py-3 text-center rtl:divide-x-reverse">
          <div>
            <p className="font-display text-lg font-extrabold text-ink" dir="ltr">
              4.9★
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Rating</p>
          </div>
          <div>
            <p className="font-display text-lg font-extrabold text-ink" dir="ltr">
              120+
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Jobs</p>
          </div>
          <div>
            <p className="font-display text-lg font-extrabold text-ink" dir="ltr">
              7y
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Exp.</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-4 w-4 text-brand-600" />
            Gulberg, Lahore
          </p>
          <span className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-glow">
            {m.hire}
          </span>
        </div>
      </div>

      {/* Floating: booking confirmed */}
      <div className="absolute -end-3 -top-8 w-60 animate-float rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-lift backdrop-blur sm:-end-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{m.bookingTitle}</p>
            <p className="truncate text-xs text-ink-muted">{m.bookingBody}</p>
          </div>
        </div>
      </div>

      {/* Floating: earnings split */}
      <div className="absolute -bottom-10 -start-3 w-64 animate-float-slow rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lift backdrop-blur [animation-delay:1.5s] sm:-start-10">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-100 text-accent-700">
            <HandCoins className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{m.earningsTitle}</p>
            <p className="truncate text-xs text-ink-muted">{m.earningsBody}</p>
          </div>
        </div>
        <div className="mt-3 flex h-2 overflow-hidden rounded-full" dir="ltr">
          <div className="w-[90%] bg-gradient-to-r from-brand-500 to-brand-700" />
          <div className="flex-1 bg-accent-400" />
        </div>
      </div>
    </div>
  );
}
