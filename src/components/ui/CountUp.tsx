import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Display value such as "100%", "8", "24h", "10٪". Leading digits animate; the rest is kept. */
  value: string;
  durationMs?: number;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function canAnimate(): boolean {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Counts a number up from 0 the first time it scrolls into view.
 * Screen readers always get the final value; the animated digits are aria-hidden.
 */
export function CountUp({ value, durationMs = 1400, className }: CountUpProps) {
  const match = /^(\d+)(.*)$/.exec(value);
  const hasNumber = match !== null;
  const target = match ? Number(match[1]) : 0;
  const suffix = match?.[2] ?? '';

  const ref = useRef<HTMLSpanElement>(null);
  // null = show the final value (no animation possible / finished).
  const [current, setCurrent] = useState<number | null>(() => (canAnimate() ? 0 : null));

  useEffect(() => {
    const node = ref.current;
    if (!hasNumber || !node || !canAnimate()) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          setCurrent(progress < 1 ? Math.round(easeOutCubic(progress) * target) : null);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [hasNumber, target, durationMs]);

  if (!hasNumber) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {current ?? target}
        {suffix}
      </span>
    </span>
  );
}
