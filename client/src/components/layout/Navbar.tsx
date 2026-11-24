import { ArrowRight, BadgeCheck, ChevronDown, Menu, X } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { CategoryIcon } from '@/components/marketing/CategoryIcon';
import { Logo } from '@/components/marketing/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { CATEGORY_SLUGS, useContent } from '@/content';
import { useDismiss, useLockBodyScroll } from '@/hooks/useDismiss';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/lib/cn';

import { LanguageToggle } from './LanguageToggle';

type Menu = 'services' | 'mobile';

/**
 * Premium site header.
 * - Transparent over the dark hero, frosted white once scrolled or a menu is open.
 * - Desktop: services mega-menu. Mobile: full-screen sheet with scroll lock.
 * - Menus are keyed to the current location, so any navigation closes them.
 */
export function Navbar() {
  const { nav, categories, common } = useContent();
  const location = useLocation();
  const scrolled = useScrolled();

  const [openMenu, setOpenMenu] = useState<{ menu: Menu; key: string } | null>(null);
  const isOpen = (menu: Menu) => openMenu?.menu === menu && openMenu.key === location.key;
  const servicesOpen = isOpen('services');
  const mobileOpen = isOpen('mobile');

  const close = useCallback(() => {
    setOpenMenu(null);
  }, []);
  const toggle = (menu: Menu) => {
    setOpenMenu(isOpen(menu) ? null : { menu, key: location.key });
  };

  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  useDismiss(servicesRef, servicesOpen, (reason) => {
    close();
    if (reason === 'escape') servicesButtonRef.current?.focus();
  });
  const headerRef = useRef<HTMLElement>(null);
  useDismiss(headerRef, mobileOpen, close);
  useLockBodyScroll(mobileOpen);

  const servicesPanelId = useId();
  const mobilePanelId = useId();

  const solid = scrolled || mobileOpen || servicesOpen;
  const tone = solid ? 'dark' : 'light';
  const servicesActive = location.pathname.startsWith('/services');

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative rounded-xl px-3.5 py-2 text-[0.95rem] font-medium transition-colors',
      solid
        ? isActive
          ? 'text-brand-800'
          : 'text-ink-soft hover:bg-slate-100 hover:text-ink'
        : isActive
          ? 'text-white'
          : 'text-white/80 hover:bg-white/10 hover:text-white',
      isActive &&
        'after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent-400',
    );

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        solid
          ? 'border-b border-slate-200/70 bg-white/85 shadow-[0_8px_30px_-12px_rgb(15_23_42/0.15)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        className="container flex h-[4.5rem] items-center justify-between gap-4"
        aria-label="Main"
      >
        <Logo tone={solid ? 'dark' : 'light'} onClick={close} />

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          <li>
            <div ref={servicesRef} className="relative">
              <button
                ref={servicesButtonRef}
                type="button"
                aria-expanded={servicesOpen}
                aria-controls={servicesPanelId}
                onClick={() => {
                  toggle('services');
                }}
                className={cn(
                  linkClass({ isActive: servicesActive }),
                  'inline-flex items-center gap-1',
                )}
              >
                {nav.services}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    servicesOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>

              {servicesOpen ? (
                <div
                  id={servicesPanelId}
                  className="absolute start-1/2 top-full mt-3 w-[min(54rem,calc(100vw-3rem))] -translate-x-1/2 animate-slide-down rtl:translate-x-1/2"
                >
                  <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift lg:grid-cols-[1fr_17rem]">
                    <div className="p-6">
                      <p className="text-sm font-semibold text-ink">{nav.servicesMenuTitle}</p>
                      <p className="text-sm text-ink-muted">{nav.servicesMenuDescription}</p>
                      <ul className="mt-4 grid grid-cols-2 gap-1">
                        {CATEGORY_SLUGS.map((slug) => (
                          <li key={slug}>
                            <Link
                              to={`/services#${slug}`}
                              onClick={close}
                              className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-slate-50"
                            >
                              <CategoryIcon slug={slug} size="sm" />
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-ink group-hover:text-brand-800">
                                  {categories[slug].name}
                                </span>
                                <span className="block truncate text-xs text-ink-muted">
                                  {categories[slug].short}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/services"
                        onClick={close}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
                      >
                        {nav.servicesMenuCta}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                      </Link>
                    </div>
                    <div className="relative isolate overflow-hidden bg-brand-950 p-6 text-white">
                      <div
                        aria-hidden="true"
                        className="bg-grid-dark absolute inset-0 -z-10 opacity-60"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute -end-10 -top-10 -z-10 h-40 w-40 rounded-full bg-brand-500/40 blur-2xl"
                      />
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-400 text-brand-950">
                        <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <p className="mt-4 font-display text-lg font-bold">
                        {nav.servicesMenuPromoTitle}
                      </p>
                      <p className="mt-2 text-sm text-brand-100/75">{nav.servicesMenuPromoBody}</p>
                      <Link
                        to="/tevta"
                        onClick={close}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-300 hover:text-accent-200"
                      >
                        {common.learnMore}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </li>
          {nav.links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <LanguageToggle tone={tone} />
          <Link
            to="/login"
            className={cn(
              'rounded-xl px-3.5 py-2 text-[0.95rem] font-semibold transition-colors',
              solid ? 'text-ink hover:bg-slate-100' : 'text-white hover:bg-white/10',
            )}
          >
            {nav.login}
          </Link>
          <ButtonLink to="/signup" variant="accent" size="md" className="ms-1">
            {nav.signup}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </ButtonLink>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageToggle tone={tone} showLabel={false} />
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobilePanelId}
            aria-label={mobileOpen ? nav.closeMenu : nav.openMenu}
            onClick={() => {
              toggle('mobile');
            }}
            className={cn(
              'grid h-11 w-11 place-items-center rounded-xl transition-colors',
              solid ? 'text-ink hover:bg-slate-100' : 'text-white hover:bg-white/10',
            )}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      {mobileOpen ? (
        <div
          id={mobilePanelId}
          className="fixed inset-x-0 bottom-0 top-[4.5rem] animate-fade-in overflow-y-auto overscroll-contain border-t border-slate-200 bg-white lg:hidden"
        >
          <div className="container flex min-h-full flex-col gap-8 py-6">
            <div>
              <p className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                {nav.services}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {CATEGORY_SLUGS.map((slug) => (
                  <li key={slug}>
                    <Link
                      to={`/services#${slug}`}
                      onClick={close}
                      className="flex items-center gap-2.5 rounded-2xl border border-slate-200 p-2.5 text-sm font-semibold text-ink active:bg-slate-50"
                    >
                      <CategoryIcon slug={slug} size="sm" />
                      <span className="truncate">{categories[slug].name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="divide-y divide-slate-100 border-y border-slate-100">
              {nav.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={close}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between py-4 text-lg font-semibold',
                        isActive ? 'text-brand-700' : 'text-ink',
                      )
                    }
                  >
                    {link.label}
                    <ArrowRight
                      className="h-5 w-5 text-slate-400 rtl:rotate-180"
                      aria-hidden="true"
                    />
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-auto grid gap-3 pb-[env(safe-area-inset-bottom)]">
              <ButtonLink to="/signup" variant="accent" size="lg" onClick={close}>
                {nav.signup}
              </ButtonLink>
              <ButtonLink to="/login" variant="outline" size="lg" onClick={close}>
                {nav.login}
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
