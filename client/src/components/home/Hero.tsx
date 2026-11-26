import { MapPin, Search } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { CATEGORY_SLUGS, useContent, type CategorySlug } from '@/content';

import { HeroMockup } from './HeroMockup';

const POPULAR: CategorySlug[] = ['plumber', 'electrician', 'ac-technician', 'cleaner'];

function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function Hero() {
  const { home, categories } = useContent();
  const copy = home.hero;
  const navigate = useNavigate();
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const serviceId = useId();
  const cityId = useId();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    const query = params.toString();
    const hash = isCategorySlug(service) ? `#${service}` : '';
    void navigate(`/services${query ? `?${query}` : ''}${hash}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 pt-32 sm:pt-36 lg:pt-40">
      {/* Backdrop */}
      <div aria-hidden="true" className="bg-grid-dark mask-fade-b absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute -top-40 start-[-10%] -z-10 h-[34rem] w-[34rem] rounded-full bg-brand-500/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute end-[-10%] top-1/3 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-400/15 blur-3xl"
      />

      <div className="container grid items-center gap-16 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-32">
        {/* Copy + search */}
        <div>
          <div className="animate-fade-up">
            <Badge tone="dark" icon={<span className="h-1.5 w-1.5 rounded-full bg-accent-400" />}>
              {copy.badge}
            </Badge>
          </div>

          <h1 className="mt-6 animate-fade-up text-balance text-[2.6rem] font-extrabold leading-[1.08] text-white [animation-delay:80ms] sm:text-6xl lg:text-[4.1rem]">
            {copy.titleStart} <span className="text-gradient-brand">{copy.titleHighlight}</span>{' '}
            {copy.titleEnd}
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up text-pretty text-lg text-brand-100/80 [animation-delay:160ms]">
            {copy.subtitle}
          </p>

          <form
            onSubmit={onSubmit}
            role="search"
            className="mt-9 grid animate-fade-up gap-2 rounded-3xl bg-white p-2 shadow-lift [animation-delay:240ms] sm:grid-cols-[1fr_1fr_auto]"
          >
            <div className="relative">
              <label htmlFor={serviceId} className="sr-only">
                {copy.serviceLabel}
              </label>
              <Search
                className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-600"
                aria-hidden="true"
              />
              <select
                id={serviceId}
                value={service}
                onChange={(event) => {
                  setService(event.target.value);
                }}
                className="h-14 w-full rounded-2xl border-0 bg-slate-50 pe-10 ps-12 font-medium text-ink focus:bg-white focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="">{copy.servicePlaceholder}</option>
                {CATEGORY_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {categories[slug].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label htmlFor={cityId} className="sr-only">
                {copy.cityLabel}
              </label>
              <MapPin
                className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-600"
                aria-hidden="true"
              />
              <select
                id={cityId}
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                }}
                className="h-14 w-full rounded-2xl border-0 bg-slate-50 pe-10 ps-12 font-medium text-ink focus:bg-white focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="">{copy.cityPlaceholder}</option>
                {siteConfig.cities.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" size="lg" className="h-14 rounded-2xl">
              <Search className="h-5 w-5" aria-hidden="true" />
              {copy.searchCta}
            </Button>
          </form>

          <div className="mt-5 flex animate-fade-up flex-wrap items-center gap-2 text-sm [animation-delay:320ms]">
            <span className="text-brand-100/60">{copy.popular}</span>
            {POPULAR.map((slug) => (
              <Link
                key={slug}
                to={`/services#${slug}`}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-brand-100/90 transition hover:border-accent-300/60 hover:text-white"
              >
                {categories[slug].name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product preview */}
        <div className="animate-fade-up px-4 py-10 [animation-delay:200ms] sm:px-10 lg:px-6">
          <HeroMockup />
        </div>
      </div>

      {/* Cities marquee */}
      <div className="border-t border-white/10 bg-white/[0.03]">
        <div className="container flex items-center gap-6 py-5">
          <p className="hidden shrink-0 text-sm font-semibold text-brand-100/70 md:block">
            {copy.citiesLabel}
          </p>
          <div className="mask-fade-x relative flex-1 overflow-hidden" dir="ltr">
            <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
              {[0, 1].map((copyIndex) => (
                <ul
                  key={copyIndex}
                  className="flex shrink-0 gap-10"
                  aria-hidden={copyIndex === 1 ? 'true' : undefined}
                >
                  {siteConfig.cities.map((name) => (
                    <li
                      key={name}
                      className="flex items-center gap-2 text-sm font-medium text-brand-100/70"
                    >
                      <MapPin className="h-4 w-4 text-accent-300" aria-hidden="true" />
                      {name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
