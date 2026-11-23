import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';

import { LanguageSwitcher } from './LanguageSwitcher';

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-700" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Temporary shell for Phase 1; replaced by PublicLayout / DashboardLayout in Phase 2. */
export function RootLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-800">
            <img src="/favicon.svg" alt="" width={32} height={32} className="h-8 w-8" />
            {t('appName')}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main id="main" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {t('appName')}
      </footer>
    </div>
  );
}
