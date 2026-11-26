import { useId, useRef, useState, type KeyboardEvent } from 'react';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';
import { cn } from '@/lib/cn';

type Audience = 'customers' | 'workers';
const AUDIENCES: Audience[] = ['customers', 'workers'];

export function HowItWorks() {
  const { home } = useContent();
  const copy = home.howItWorks;
  const [active, setActive] = useState<Audience>('customers');
  const baseId = useId();
  const tabRefs = useRef<Record<Audience, HTMLButtonElement | null>>({
    customers: null,
    workers: null,
  });

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next: Audience = active === 'customers' ? 'workers' : 'customers';
    const target = event.key === 'Home' ? 'customers' : event.key === 'End' ? 'workers' : next;
    setActive(target);
    tabRefs.current[target]?.focus();
  };

  const steps = copy.tabs[active].steps;

  return (
    <section
      className="section relative isolate overflow-hidden bg-slate-50"
      aria-labelledby="how-heading"
    >
      <div aria-hidden="true" className="bg-grid-light mask-fade-b absolute inset-0 -z-10" />
      <div className="container">
        <SectionHeading id="how-heading" {...copy} />

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label={copy.eyebrow}
            className="inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-soft"
          >
            {AUDIENCES.map((audience) => {
              const selected = audience === active;
              return (
                <button
                  key={audience}
                  ref={(node) => {
                    tabRefs.current[audience] = node;
                  }}
                  id={`${baseId}-tab-${audience}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onKeyDown={onKeyDown}
                  onClick={() => {
                    setActive(audience);
                  }}
                  className={cn(
                    'rounded-xl px-5 py-2.5 text-sm font-semibold transition-all sm:px-7',
                    selected
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {copy.tabs[audience].label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="relative mt-14"
        >
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[12.5%] top-8 hidden border-t-2 border-dashed border-brand-200 lg:block"
          />
          <ol key={active} className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 90} className="text-center">
                <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white font-display text-2xl font-extrabold text-brand-700 shadow-soft ring-1 ring-slate-200">
                  {index + 1}
                  {index === steps.length - 1 ? (
                    <span className="absolute -end-1 -top-1 h-4 w-4 rounded-full bg-accent-400 ring-4 ring-slate-50" />
                  ) : null}
                </div>
                <h3 className="mt-6 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
