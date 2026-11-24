import {
  Eye,
  Handshake,
  HeartHandshake,
  MapPin,
  Scale,
  ShieldCheck,
  Target,
  type LucideIcon,
} from 'lucide-react';

import { PageHero } from '@/components/marketing/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';

const VALUE_ICONS: LucideIcon[] = [ShieldCheck, Scale, Handshake, MapPin];

export default function AboutPage() {
  const { about: copy } = useContent();

  return (
    <>
      <PageHero content={copy.hero} />

      {/* Story */}
      <section className="section bg-white" aria-labelledby="story-heading">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            id="story-heading"
            align="start"
            eyebrow={copy.story.eyebrow}
            title={copy.story.title}
          />
          <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-ink-muted">
            {copy.story.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section
        className="pb-20 sm:pb-24"
        aria-label={`${copy.mission.title} / ${copy.vision.title}`}
      >
        <div className="container grid gap-6 md:grid-cols-2">
          {[
            { ...copy.mission, Icon: Target, dark: true },
            { ...copy.vision, Icon: Eye, dark: false },
          ].map(({ title, body, Icon, dark }, index) => (
            <Reveal
              key={title}
              delay={index * 100}
              className={
                dark
                  ? 'relative overflow-hidden rounded-4xl bg-brand-900 p-8 text-white shadow-lift sm:p-10'
                  : 'rounded-4xl border border-slate-200 bg-gradient-to-br from-accent-50 to-white p-8 sm:p-10'
              }
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl ${dark ? 'bg-accent-400 text-brand-950' : 'bg-brand-700 text-white'}`}
              >
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className={`mt-6 text-2xl font-extrabold ${dark ? 'text-white' : 'text-ink'}`}>
                {title}
              </h2>
              <p
                className={`mt-3 text-lg leading-relaxed ${dark ? 'text-brand-100/85' : 'text-ink-soft'}`}
              >
                {body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section bg-slate-50" aria-labelledby="values-heading">
        <div className="container">
          <SectionHeading id="values-heading" {...copy.values} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.values.items.map((value, index) => {
              const Icon = VALUE_ICONS[index] ?? HeartHandshake;
              return (
                <Reveal as="li" key={value.title} delay={index * 80} className="card p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{value.title}</h3>
                  <p className="mt-1.5 text-ink-muted">{value.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Commitments */}
      <section className="section bg-white" aria-labelledby="commitments-heading">
        <div className="container">
          <SectionHeading
            id="commitments-heading"
            eyebrow={copy.commitments.eyebrow}
            title={copy.commitments.title}
          />
          <dl className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.commitments.items.map((item, index) => (
              <Reveal
                key={item.label}
                delay={index * 80}
                className="flex flex-col-reverse rounded-3xl bg-gradient-to-b from-brand-50 to-white p-7 text-center ring-1 ring-brand-100"
              >
                <dt className="mt-2 text-ink-muted">{item.label}</dt>
                <dd className="font-display text-5xl font-extrabold text-brand-700" dir="ltr">
                  {item.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
