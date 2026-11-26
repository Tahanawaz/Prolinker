import {
  ArrowRight,
  CalendarCheck,
  CircleCheck,
  Headset,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { CategoryIcon } from '@/components/marketing/CategoryIcon';
import { PageHero } from '@/components/marketing/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CATEGORY_SLUGS, useContent } from '@/content';
import { cn } from '@/lib/cn';

const GUARANTEE_ICONS: LucideIcon[] = [ShieldCheck, Tag, CalendarCheck, Headset];

export default function ServicesPage() {
  const { services, categories } = useContent();
  const { hash } = useLocation();
  const highlighted = hash.slice(1);

  return (
    <>
      <PageHero content={services.hero} />

      <section className="section bg-white" aria-label={services.hero.title}>
        <div className="container grid gap-6 lg:grid-cols-2">
          {CATEGORY_SLUGS.map((slug, index) => {
            const category = categories[slug];
            const isTarget = highlighted === slug;
            return (
              <Reveal
                as="article"
                key={slug}
                delay={(index % 2) * 80}
                className={cn(
                  'scroll-mt-28 rounded-4xl border bg-white p-7 transition-shadow duration-500 sm:p-9',
                  isTarget
                    ? 'border-brand-300 shadow-glow ring-4 ring-brand-100'
                    : 'border-slate-200/80 shadow-soft',
                )}
              >
                <div id={slug} className="flex items-start gap-5">
                  <CategoryIcon slug={slug} size="lg" />
                  <div>
                    <h2 className="text-2xl font-extrabold text-ink">{category.name}</h2>
                    <p className="mt-2 text-ink-muted">{category.description}</p>
                  </div>
                </div>
                <h3 className="mt-7 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {services.includesTitle}
                </h3>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {category.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-ink-soft">
                      <CircleCheck
                        className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <ButtonLink to="/signup" variant="outline" className="mt-8">
                  {services.bookCta} {category.name}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </ButtonLink>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section bg-slate-50" aria-labelledby="guarantee-heading">
        <div className="container">
          <SectionHeading id="guarantee-heading" {...services.guarantee} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.guarantee.items.map((item, index) => {
              const Icon = GUARANTEE_ICONS[index] ?? ShieldCheck;
              return (
                <Reveal
                  as="li"
                  key={item.title}
                  delay={index * 80}
                  className="card card-interactive group p-7"
                >
                  <span className="icon-pop grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-white">
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
    </>
  );
}
