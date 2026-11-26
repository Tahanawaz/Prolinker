import { ArrowRight, BadgeCheck, CircleCheck, Users } from 'lucide-react';

import { PageHero } from '@/components/marketing/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';

export default function TevtaPage() {
  const { tevta: copy, common } = useContent();

  const audiences = [
    {
      ...copy.forWorkers,
      Icon: BadgeCheck,
      tone: 'bg-brand-900 text-white',
      iconTone: 'bg-accent-400 text-brand-950',
      textTone: 'text-brand-100/85',
      check: 'text-accent-300',
    },
    {
      ...copy.forCustomers,
      Icon: Users,
      tone: 'bg-white border border-slate-200 shadow-soft',
      iconTone: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
      textTone: 'text-ink-soft',
      check: 'text-brand-600',
    },
  ];

  return (
    <>
      <PageHero content={copy.hero}>
        <ButtonLink to="/signup" variant="accent" size="lg">
          {common.joinAsWorker}
          <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
        </ButtonLink>
      </PageHero>

      <section className="section bg-white" aria-labelledby="partnership-heading">
        <div className="container max-w-3xl">
          <SectionHeading
            id="partnership-heading"
            eyebrow={copy.about.eyebrow}
            title={copy.about.title}
          />
          <Reveal
            delay={100}
            className="mt-8 space-y-5 text-center text-lg leading-relaxed text-ink-muted"
          >
            {copy.about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-24" aria-label={copy.hero.eyebrow}>
        <div className="container grid gap-6 lg:grid-cols-2">
          {audiences.map(({ title, items, Icon, tone, iconTone, textTone, check }, index) => (
            <Reveal key={title} delay={index * 100} className={`rounded-4xl p-8 sm:p-10 ${tone}`}>
              <span className={`grid h-14 w-14 place-items-center rounded-2xl ${iconTone}`}>
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-2xl font-extrabold">{title}</h2>
              <ul className="mt-6 space-y-3.5">
                {items.map((item) => (
                  <li key={item} className={`flex items-start gap-3 ${textTone}`}>
                    <CircleCheck
                      className={`mt-0.5 h-5 w-5 shrink-0 ${check}`}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section bg-slate-50" aria-labelledby="badge-steps-heading">
        <div className="container">
          <SectionHeading id="badge-steps-heading" {...copy.steps} />
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.items.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 80}
                className="card card-interactive group relative p-7"
              >
                <span
                  className="font-display text-5xl font-extrabold text-brand-100"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-ink-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
