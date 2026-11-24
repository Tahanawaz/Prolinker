import { Calculator } from 'lucide-react';
import { useId, useState } from 'react';

import { siteConfig } from '@/config/site';
import { useContent } from '@/content';
import { cn } from '@/lib/cn';
import { formatPKR } from '@/utils/format';

const MIN = 500;
const MAX = 50_000;
const STEP = 500;

interface EarningsCalculatorProps {
  className?: string;
}

/** Interactive illustration of the flat-fee split. Display only; real fees are computed server-side. */
export function EarningsCalculator({ className }: EarningsCalculatorProps) {
  const { calculator: copy } = useContent();
  const [amount, setAmount] = useState(5_000);
  const sliderId = useId();

  const fee = Math.round(amount * siteConfig.commissionRate);
  const earn = amount - fee;
  const workerShare = Math.round((1 - siteConfig.commissionRate) * 100);
  const progress = ((amount - MIN) / (MAX - MIN)) * 100;

  return (
    <div
      className={cn(
        'rounded-4xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-lift backdrop-blur-xl sm:p-8',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-400 text-brand-950">
          <Calculator className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-xl font-bold">{copy.title}</h3>
          <p className="mt-1 text-sm text-brand-100/75">{copy.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={sliderId} className="text-sm font-medium text-brand-100/80">
            {copy.amountLabel}
          </label>
          <output
            htmlFor={sliderId}
            className="font-display text-3xl font-extrabold tabular-nums"
            dir="ltr"
          >
            {formatPKR(amount)}
          </output>
        </div>
        <input
          id={sliderId}
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={amount}
          onChange={(event) => {
            setAmount(Number(event.target.value));
          }}
          aria-valuetext={formatPKR(amount)}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full accent-accent-400"
          style={{
            background: `linear-gradient(to right, #fbbf24 ${progress}%, rgb(255 255 255 / 0.15) ${progress}%)`,
          }}
          dir="ltr"
        />
        <div className="mt-2 flex justify-between text-xs text-brand-100/60" dir="ltr">
          <span>{formatPKR(MIN)}</span>
          <span>{formatPKR(MAX)}</span>
        </div>
      </div>

      <dl className="mt-8 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-brand-100/75">{copy.jobAmount}</dt>
          <dd className="font-semibold tabular-nums" dir="ltr">
            {formatPKR(amount)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-brand-100/75">{copy.platformFee}</dt>
          <dd className="font-semibold tabular-nums text-brand-100/90" dir="ltr">
            − {formatPKR(fee)}
          </dd>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-brand-500/15 px-4 py-4 ring-1 ring-inset ring-brand-400/30">
          <dt className="font-semibold text-white">
            {copy.youEarn} <span className="text-brand-200">({workerShare}%)</span>
          </dt>
          <dd
            className="font-display text-2xl font-extrabold tabular-nums text-accent-300"
            dir="ltr"
          >
            {formatPKR(earn)}
          </dd>
        </div>
      </dl>

      {/* Visual split bar */}
      <div className="mt-6 flex h-2.5 overflow-hidden rounded-full" aria-hidden="true" dir="ltr">
        <div className="bg-accent-400" style={{ width: `${workerShare}%` }} />
        <div className="flex-1 bg-white/25" />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-brand-100/60">{copy.note}</p>
    </div>
  );
}
