import { ArrowRight, MessagesSquare } from 'lucide-react';

import { PageHero } from '@/components/marketing/PageHero';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { useContent } from '@/content';

const groupId = (index: number): string => `faq-group-${index + 1}`;

export default function FaqPage() {
  const { faq: copy } = useContent();

  return (
    <>
      <PageHero content={copy.hero} />

      <section className="section bg-white">
        <div className="container grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
          {/* Section index */}
          <nav aria-label={copy.hero.eyebrow} className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {copy.groups.map((group, index) => (
                <li key={group.title} className="shrink-0">
                  <a
                    href={`#${groupId(index)}`}
                    className="block rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-800 lg:border-transparent lg:hover:bg-brand-50"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {copy.groups.map((group, index) => (
              <Reveal as="section" key={group.title}>
                <h2 id={groupId(index)} className="scroll-mt-28 text-2xl font-extrabold text-ink">
                  {group.title}
                </h2>
                <Accordion items={group.items} defaultOpen={-1} className="mt-5" />
              </Reveal>
            ))}

            <Reveal className="flex flex-col items-start gap-6 rounded-4xl bg-brand-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-400 text-brand-950">
                  <MessagesSquare className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{copy.stillQuestions.title}</h2>
                  <p className="mt-1 text-brand-100/80">{copy.stillQuestions.body}</p>
                </div>
              </div>
              <ButtonLink to="/contact" variant="accent" size="lg" className="shrink-0">
                {copy.stillQuestions.cta}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
