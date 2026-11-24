import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonLink } from '@/components/ui/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 pb-28 pt-40 text-center sm:pt-48">
      <div aria-hidden="true" className="bg-grid-dark mask-fade-b absolute inset-0 -z-10" />
      <div className="container">
        <p
          className="text-gradient-brand font-display text-8xl font-extrabold sm:text-9xl"
          dir="ltr"
        >
          404
        </p>
        <h1 className="mt-6 text-3xl font-extrabold text-white">{t('notFound.title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-brand-100/75">{t('notFound.body')}</p>
        <ButtonLink to="/" variant="accent" size="lg" className="mt-10">
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
          {t('notFound.home')}
        </ButtonLink>
      </div>
    </section>
  );
}
