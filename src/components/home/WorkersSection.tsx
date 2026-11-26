import { ArrowRight, Gift, HandCoins, LifeBuoy, type LucideIcon } from 'lucide-react';

import { EarningsCalculator } from '@/components/marketing/EarningsCalculator';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';

const ICONS: LucideIcon[] = [HandCoins, Gift, LifeBuoy];

export function WorkersSection() {
  const { home, common } = useContent();
  const copy = home.workers;

  return (
    <section
      className="section relative isolate overflow-hidden bg-brand-950"
      aria-labelledby="workers-heading"
    >
      <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden="true"
        className="absolute -start-40 top-0 -z-10 h-[30rem] w-[30rem] animate-blob rounded-full bg-brand-500/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 end-0 -z-10 h-96 w-96 animate-blob-slow rounded-full bg-accent-400/15 blur-3xl"
      />

      <div className="container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading id="workers-heading" align="start" tone="dark" {...copy} />

          <ul className="mt-10 space-y-6">
            {copy.bullets.map((bullet, index) => {
              const Icon = ICONS[index] ?? HandCoins;
              return (
                <Reveal as="li" key={bullet.title} delay={index * 90} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-accent-300">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans text-lg font-semibold text-white">{bullet.title}</h3>
                    <p className="mt-1 text-brand-100/70">{bullet.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/signup" variant="accent" size="lg">
              {common.joinAsWorker}
              <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/for-workers" variant="glass" size="lg">
              {common.learnMore}
            </ButtonLink>
          </div>
        </div>

        <Reveal delay={150}>
          <EarningsCalculator />
        </Reveal>
      </div>
    </section>
  );
}
