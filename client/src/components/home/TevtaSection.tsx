import { ArrowRight, BadgeCheck, CircleCheck, GraduationCap, ShieldCheck } from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';

/** Decorative certificate card illustrating the TEVTA badge. */
function CertificateVisual({ title, body }: { title: string; body: string }) {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
      <div className="absolute inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent-300/50 to-brand-400/40 blur-2xl" />
      <div className="relative rotate-[-2deg] rounded-[2rem] border border-accent-200 bg-gradient-to-br from-white to-accent-50 p-8 shadow-lift">
        <div className="flex items-center justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-800 text-white">
            <GraduationCap className="h-7 w-7" />
          </span>
          <span className="rounded-full bg-brand-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            TEVTA
          </span>
        </div>
        <div className="mt-8 space-y-2.5">
          <div className="h-3 w-3/4 rounded-full bg-slate-200" />
          <div className="h-3 w-1/2 rounded-full bg-slate-200" />
          <div className="h-3 w-2/3 rounded-full bg-slate-200" />
        </div>
        <div className="mt-8 flex items-end justify-between">
          <div className="space-y-1.5">
            <div className="h-2 w-24 rounded-full bg-slate-300" />
            <div className="h-2 w-16 rounded-full bg-slate-200" />
          </div>
          <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-double border-accent-500 text-accent-600">
            <ShieldCheck className="h-9 w-9" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 -end-2 flex animate-float items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 pe-5 shadow-lift sm:-end-8">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-400 text-brand-950">
          <BadgeCheck className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">{title}</p>
          <p className="text-xs text-ink-muted">{body}</p>
        </div>
      </div>
    </div>
  );
}

export function TevtaSection() {
  const { home, common } = useContent();
  const copy = home.tevta;

  return (
    <section
      className="section relative isolate overflow-hidden bg-gradient-to-b from-accent-50/60 to-white"
      aria-labelledby="tevta-heading"
    >
      <div className="container grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 px-4 pb-8 lg:order-1">
          <CertificateVisual title={copy.badgeTitle} body={copy.badgeBody} />
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading id="tevta-heading" align="start" {...copy} />
          <ul className="mt-8 space-y-4">
            {copy.points.map((point, index) => (
              <Reveal as="li" key={point} delay={index * 80} className="flex items-start gap-3">
                <CircleCheck
                  className="mt-0.5 h-6 w-6 shrink-0 text-brand-600"
                  aria-hidden="true"
                />
                <span className="text-lg text-ink-soft">{point}</span>
              </Reveal>
            ))}
          </ul>
          <ButtonLink to="/tevta" variant="primary" size="lg" className="mt-10">
            {common.learnMore}
            <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
