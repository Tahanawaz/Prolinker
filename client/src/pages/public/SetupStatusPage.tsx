import type { HealthStatus } from '@prolinker/shared';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { api } from '@/lib/api';
import { cn } from '@/lib/cn';

type Tone = 'pending' | 'ok' | 'warn' | 'fail';

const toneStyles: Record<Tone, string> = {
  pending: 'bg-slate-100 text-slate-600',
  ok: 'bg-brand-100 text-brand-800',
  warn: 'bg-accent-100 text-accent-700',
  fail: 'bg-red-100 text-red-700',
};

function StatusRow({ label, tone, text }: { label: string; tone: Tone; text: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="font-medium text-slate-700">{label}</dt>
      <dd>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
            toneStyles[tone],
          )}
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
          {text}
        </span>
      </dd>
    </div>
  );
}

/** Phase 1 landing page: proves client → API → database wiring end to end. */
export default function SetupStatusPage() {
  const { t } = useTranslation();

  const health = useQuery({
    queryKey: ['health', 'ready'],
    queryFn: () => api.get<HealthStatus>('/health/ready'),
    retry: false,
  });

  const apiTone: Tone = health.isPending ? 'pending' : health.isError ? 'fail' : 'ok';
  const dbState = health.data?.checks?.database;
  const dbTone: Tone = health.isPending
    ? 'pending'
    : dbState === 'ok'
      ? 'ok'
      : health.isError
        ? 'fail'
        : 'warn';

  const label = (tone: Tone): string =>
    ({
      pending: t('setup.checking'),
      ok: t('setup.online'),
      warn: t('setup.degraded'),
      fail: t('setup.offline'),
    })[tone];

  return (
    <section className="container py-10 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          {t('tagline')}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {t('setup.title')}
        </h1>
        <p className="mt-4 text-base text-slate-600 sm:text-lg">{t('setup.subtitle')}</p>
      </div>

      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <dl className="divide-y divide-slate-100" aria-live="polite">
          <StatusRow label={t('setup.apiStatus')} tone={apiTone} text={label(apiTone)} />
          <StatusRow label={t('setup.dbStatus')} tone={dbTone} text={label(dbTone)} />
        </dl>
        <button
          type="button"
          onClick={() => void health.refetch()}
          disabled={health.isFetching}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand-700 px-4 font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {health.isFetching ? t('setup.checking') : t('setup.retry')}
        </button>
      </div>
    </section>
  );
}
