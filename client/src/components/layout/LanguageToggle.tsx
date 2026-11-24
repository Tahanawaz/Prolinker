import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useContent } from '@/content';
import { cn } from '@/lib/cn';

interface LanguageToggleProps {
  tone: 'light' | 'dark';
  className?: string;
  showLabel?: boolean;
}

/** One-tap English ⇄ اردو switch. */
export function LanguageToggle({ tone, className, showLabel = true }: LanguageToggleProps) {
  const { i18n } = useTranslation();
  const { nav } = useContent();
  const isUrdu = i18n.resolvedLanguage === 'ur';
  const next = isUrdu ? 'en' : 'ur';

  return (
    <button
      type="button"
      lang={next}
      onClick={() => void i18n.changeLanguage(next)}
      aria-label={nav.switchLanguage}
      title={nav.switchLanguage}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors',
        tone === 'light'
          ? 'text-white/90 hover:bg-white/10 hover:text-white'
          : 'text-ink-soft hover:bg-slate-100 hover:text-ink',
        className,
      )}
    >
      <Languages className="h-[18px] w-[18px]" aria-hidden="true" />
      {showLabel ? (
        <span className={isUrdu ? 'font-sans' : 'font-urdu'}>{isUrdu ? 'English' : 'اردو'}</span>
      ) : null}
    </button>
  );
}
