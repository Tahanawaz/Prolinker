import { SUPPORTED_LANGUAGES } from '@prolinker/shared';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/cn';

interface LanguageSwitcherProps {
  className?: string;
}

/** Segmented EN / اردو toggle. Switching updates <html lang dir> via i18n. */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={cn('inline-flex rounded-lg border border-slate-200 bg-white p-0.5', className)}
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = i18n.resolvedLanguage === lang;
        return (
          <button
            key={lang}
            type="button"
            lang={lang}
            aria-pressed={active}
            onClick={() => void i18n.changeLanguage(lang)}
            className={cn(
              'min-h-9 min-w-12 rounded-md px-3 text-sm font-medium transition-colors',
              active ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {t(`language.${lang}`)}
          </button>
        );
      })}
    </div>
  );
}
