import { Reveal } from '@/components/ui/Reveal';
import { useContent } from '@/content';

/** Honest platform facts (no invented usage numbers before launch). */
export function StatsStrip() {
  const { home } = useContent();
  return (
    <section aria-label="ProLinker at a glance" className="relative z-10 -mt-px bg-white">
      <div className="container">
        <dl className="grid grid-cols-2 divide-slate-100 border-b border-slate-100 lg:grid-cols-4 lg:divide-x rtl:lg:divide-x-reverse">
          {home.stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 80}
              className="flex flex-col-reverse px-4 py-10 text-center sm:py-12"
            >
              <dt className="mt-2 text-sm font-medium text-ink-muted">{stat.label}</dt>
              <dd
                className="font-display text-4xl font-extrabold text-brand-800 sm:text-5xl"
                dir="ltr"
              >
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
