import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Logo } from '@/components/marketing/Logo';
import { SocialIcons } from '@/components/marketing/SocialIcons';
import { ButtonLink } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { useContent } from '@/content';

/** Premium footer: CTA band, brand + link columns, contact block, legal bar. */
export function Footer() {
  const { footer, common } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative isolate overflow-hidden bg-brand-950 text-brand-100"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div
        aria-hidden="true"
        className="bg-grid-dark mask-fade-b absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 start-1/4 -z-10 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl"
      />

      {/* CTA band */}
      <div className="container pt-20 sm:pt-24">
        <div className="relative isolate overflow-hidden rounded-4xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 px-6 py-12 shadow-lift ring-1 ring-white/10 sm:px-12 sm:py-14 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div
            aria-hidden="true"
            className="absolute -end-20 -top-24 -z-10 h-72 w-72 animate-blob rounded-full bg-accent-400/25 blur-3xl"
          />
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-300">
              {footer.ctaEyebrow}
            </p>
            <p className="mt-3 text-balance font-display text-3xl font-extrabold text-white sm:text-4xl">
              {footer.ctaTitle}
            </p>
            <p className="mt-4 text-brand-100/80">{footer.ctaBody}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
            <ButtonLink to="/services" variant="accent" size="lg">
              {common.bookService}
              <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/for-workers" variant="glass" size="lg">
              {common.joinAsWorker}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-100/70">{footer.blurb}</p>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-brand-100/50">
            {footer.followUs}
          </p>
          <div className="mt-3">
            <SocialIcons />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-sans text-sm font-semibold text-white">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-brand-100/70 transition-colors hover:text-accent-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-sans text-sm font-semibold text-white">{footer.contactTitle}</h3>
          <ul className="mt-4 space-y-4 text-sm">
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="group flex items-start gap-3 text-brand-100/80 hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                <span dir="ltr">{siteConfig.contact.email}</span>
              </a>
            </li>
            <li>
              <a
                href={siteConfig.contact.phoneHref}
                className="group flex items-start gap-3 text-brand-100/80 hover:text-white"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                <span dir="ltr">{siteConfig.contact.phone}</span>
              </a>
            </li>
            <li className="flex items-start gap-3 text-brand-100/80">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
              <span>
                <span className="block text-brand-100/50">{footer.hoursLabel}</span>
                <span dir="ltr">{siteConfig.contact.hours}</span>
              </span>
            </li>
            <li className="flex items-start gap-3 text-brand-100/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
              <span dir="ltr">{siteConfig.contact.address}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-sm text-brand-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {footer.rights}{' '}
            <span className="hidden md:inline">· {footer.madeIn}</span>
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
