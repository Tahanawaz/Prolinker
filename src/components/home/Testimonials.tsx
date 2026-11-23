import { Quote, Star } from 'lucide-react';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_TINTS = [
  'from-brand-500 to-brand-800',
  'from-accent-400 to-accent-600',
  'from-sky-500 to-indigo-600',
];

export function Testimonials() {
  const { home, common } = useContent();
  const copy = home.testimonials;

  return (
    <section className="section bg-slate-50" aria-labelledby="testimonials-heading">
      <div className="container">
        <SectionHeading id="testimonials-heading" {...copy} />

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {copy.items.map((item, index) => (
            <Reveal
              as="li"
              key={item.name}
              delay={index * 90}
              className="relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-soft"
            >
              <Quote className="h-9 w-9 text-brand-200 rtl:-scale-x-100" aria-hidden="true" />
              <div className="mt-4 flex gap-0.5" role="img" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent-400 text-accent-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-ink-soft">
                “{item.quote}”
              </blockquote>
              <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6">
                <span
                  aria-hidden="true"
                  className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br font-semibold text-white ${AVATAR_TINTS[index % AVATAR_TINTS.length] ?? ''}`}
                >
                  {initials(item.name)}
                </span>
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-ink-muted">
                    {item.role} · {item.city}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-ink-muted">{common.sampleNotice}</p>
      </div>
    </section>
  );
}
