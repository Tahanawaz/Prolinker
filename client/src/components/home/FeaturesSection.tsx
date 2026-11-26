import { Award, Headset, ShieldCheck, Scale, Star, Wallet, type LucideIcon } from 'lucide-react';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';
import { cn } from '@/lib/cn';

const ICONS: LucideIcon[] = [ShieldCheck, Award, Scale, Wallet, Star, Headset];

export function FeaturesSection() {
  const { home } = useContent();
  const copy = home.features;

  return (
    <section className="section bg-white" aria-labelledby="features-heading">
      <div className="container">
        <SectionHeading id="features-heading" {...copy} />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length] ?? ShieldCheck;
            const featured = index === 0;
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={(index % 3) * 80}
                className={cn(
                  'group relative overflow-hidden rounded-3xl p-7 transition-all duration-300',
                  featured
                    ? 'bg-brand-900 text-white shadow-lift'
                    : 'border border-slate-200/80 bg-white hover:-translate-y-1 hover:shadow-lift',
                )}
              >
                {featured ? (
                  <div
                    aria-hidden="true"
                    className="absolute -end-16 -top-16 h-48 w-48 rounded-full bg-brand-500/40 blur-3xl"
                  />
                ) : null}
                <span
                  className={cn(
                    'relative grid h-12 w-12 place-items-center rounded-2xl',
                    featured
                      ? 'bg-accent-400 text-brand-950'
                      : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3
                  className={cn(
                    'relative mt-6 text-xl font-bold',
                    featured ? 'text-white' : 'text-ink',
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn('relative mt-2', featured ? 'text-brand-100/80' : 'text-ink-muted')}
                >
                  {item.body}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
