import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-6xl font-bold text-brand-700">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">{t('notFound.title')}</h1>
      <p className="mt-2 max-w-md text-slate-600">{t('notFound.body')}</p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-brand-700 px-5 font-semibold text-white hover:bg-brand-800"
      >
        {t('notFound.home')}
      </Link>
    </section>
  );
}
