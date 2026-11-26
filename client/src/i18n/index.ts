import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@prolinker/shared';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import urCommon from './locales/ur/common.json';

const STORAGE_KEY = 'prolinker.lang';
const RTL_LANGUAGES: readonly SupportedLanguage[] = ['ur'];

export const resources = {
  en: { common: enCommon },
  ur: { common: urCommon },
} as const;

function isSupported(value: unknown): value is SupportedLanguage {
  return typeof value === 'string' && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

function readStoredLanguage(): SupportedLanguage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSupported(stored)) return stored;
  } catch {
    // storage unavailable (private mode etc.) — fall through
  }
  return 'en';
}

/** Keep <html lang/dir> in sync so Tailwind logical utilities and screen readers follow. */
function applyDocumentLanguage(language: string): void {
  const lang = isSupported(language) ? language : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
}

void i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: 'common',
  ns: ['common'],
  interpolation: { escapeValue: false }, // React already escapes
});

applyDocumentLanguage(i18n.language);

i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language);
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // ignore
  }
});

export default i18n;
