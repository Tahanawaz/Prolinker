import {
  ArrowRight,
  Award,
  CircleCheck,
  HandCoins,
  HeartHandshake,
  LifeBuoy,
  MapPin,
  Medal,
  SlidersHorizontal,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

import { EarningsCalculator } from '@/components/marketing/EarningsCalculator';
import { PageHero } from '@/components/marketing/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';
import { cn } from '@/lib/cn';

const BENEFIT_ICONS: LucideIcon[] = [MapPin, HandCoins, SlidersHorizontal, Award, Trophy, LifeBuoy];

export default function ForWorkersPage() {
  const { workers: copy, common } = useContent();

  return (
    <>
      <PageHero content={copy.hero}>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/signup" variant="accent" size="lg">
            {common.joinAsWorker}
            <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to="#earnings" variant="glass" size="lg">
            {copy.bonus.eyebrow}
          </ButtonLink>
        </div>
      </PageHero>

      {/* Benefits */}
      <section className="section bg-white" aria-labelledby="benefits-heading">
        <div className="container">
          <SectionHeading id="benefits-heading" {...copy.benefits} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {copy.benefits.items.map((item, index) => {
              const Icon = BENEFIT_ICONS[index] ?? HandCoins;
              return (
                <Reveal
                  as="li"
                  key={item.title}
                  delay={(index % 3) * 80}
                  className="card card-interactive group p-7"
                >
                  <span className="icon-pop grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-ink-muted">{item.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Earnings + bonus */}
      <section
        id="earnings"
        className="section relative isolate scroll-mt-20 overflow-hidden bg-brand-950"
        aria-labelledby="bonus-heading"
      >
        <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 opacity-70" />
        <div
          aria-hidden="true"
          className="absolute -end-40 -top-20 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-500/25 blur-3xl"
        />
        <div className="container grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <EarningsCalculator />
          </Reveal>
          <div id="bonus" className="scroll-mt-28">
            <SectionHeading id="bonus-heading" align="start" tone="dark" {...copy.bonus} />
            <ul className="mt-8 space-y-4">
              {copy.bonus.tiers.map((tier, index) => (
                <Reveal
                  as="li"
                  key={tier.name}
                  delay={index * 90}
                  className={cn(
                    'flex items-center gap-4 rounded-3xl border p-5',
                    index === copy.bonus.tiers.length - 1
                      ? 'border-accent-300/40 bg-accent-400/10'
                      : 'border-white/10 bg-white/5',
                  )}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-400 text-brand-950">
                    <Medal className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{tier.name}</p>
                    <p className="text-sm text-brand-100/70" dir="ltr">
                      {tier.requirement}
                    </p>
                  </div>
                  <p className="font-display text-xl font-extrabold text-accent-300" dir="ltr">
                    {tier.reward}
                  </p>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-sm text-brand-100/60">{copy.bonus.note}</p>
          </div>
        </div>
      </section>

      {/* Emergency fund */}
      <section
        id="emergency-fund"
        className="section scroll-mt-20 bg-white"
        aria-labelledby="fund-heading"
      >
        <div className="container">
          <div className="grid overflow-hidden rounded-4xl border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-accent-50 lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-700 text-white">
                <HeartHandshake className="h-7 w-7" aria-hidden="true" />
              </span>
              <SectionHeading id="fund-heading" align="start" className="mt-6" {...copy.fund} />
            </div>
            <ul className="space-y-4 border-t border-slate-200 p-8 sm:p-12 lg:border-s lg:border-t-0">
              {copy.fund.points.map((point, index) => (
                <Reveal as="li" key={point} delay={index * 80} className="flex items-start gap-3">
                  <CircleCheck
                    className="mt-0.5 h-6 w-6 shrink-0 text-brand-600"
                    aria-hidden="true"
                  />
                  <span className="text-lg text-ink-soft">{point}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Requirements + steps */}
      <section className="section bg-slate-50" aria-labelledby="steps-heading">
        <div className="container grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading align="start" {...copy.requirements} />
            <ul className="mt-8 space-y-3">
              {copy.requirements.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft"
                >
                  <CircleCheck className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                  <span className="font-medium text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading id="steps-heading" align="start" {...copy.steps} />
            <ol className="relative mt-8 space-y-6 border-s-2 border-dashed border-brand-200 ps-8">
              {copy.steps.items.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 80} className="relative">
                  <span className="absolute -start-[3.15rem] top-0 grid h-10 w-10 place-items-center rounded-full bg-brand-700 font-display font-bold text-white ring-4 ring-slate-50">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-1 text-ink-muted">{step.body}</p>
                </Reveal>
              ))}
            </ol>
            <ButtonLink to="/signup" variant="primary" size="lg" className="mt-10">
              {common.joinAsWorker}
              <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
