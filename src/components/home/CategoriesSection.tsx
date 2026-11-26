import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CategoryIcon } from '@/components/marketing/CategoryIcon';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CATEGORY_SLUGS, useContent } from '@/content';

export function CategoriesSection() {
  const { home, categories, common } = useContent();

  return (
    <section className="section bg-white" aria-labelledby="categories-heading">
      <div className="container">
        <SectionHeading id="categories-heading" {...home.categories} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_SLUGS.map((slug, index) => {
            const category = categories[slug];
            return (
              <Reveal as="li" key={slug} delay={(index % 4) * 70}>
                <Link
                  to={`/services#${slug}`}
                  className="group relative flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between">
                    <CategoryIcon slug={slug} size="lg" className="icon-pop" />
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-ink-muted transition-all duration-300 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-ink">{category.name}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{category.short}</p>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-12 text-center">
          <ButtonLink to="/services" variant="outline" size="lg">
            {common.viewAll}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
