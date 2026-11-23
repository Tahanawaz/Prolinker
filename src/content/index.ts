import { useTranslation } from 'react-i18next';

import { en } from './en';
import type { SiteContent } from './types';
import { ur } from './ur';

export type * from './types';
export { CATEGORY_SLUGS } from './types';

const urMerged: SiteContent = { ...en, ...ur };

/** Site copy for the active language (untranslated Urdu sections fall back to English). */
export function useContent(): SiteContent {
  const { i18n } = useTranslation();
  return i18n.resolvedLanguage === 'ur' ? urMerged : en;
}

/** True when the active language is written right-to-left. */
export function useIsRtl(): boolean {
  const { i18n } = useTranslation();
  return i18n.dir() === 'rtl';
}
