import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/cn';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article';
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fades content up the first time it scrolls into view.
 * Content is visible immediately when motion is reduced or IntersectionObserver is unavailable.
 */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [visible]);

  // Once the entrance finishes, drop the animation class: a finished `both`-fill
  // animation would otherwise keep owning `transform` and block hover effects.
  const [settled, setSettled] = useState(false);

  const style: CSSProperties | undefined =
    delay && !settled ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      style={style}
      onAnimationEnd={(event: AnimationEvent<HTMLElement>) => {
        if (event.target === event.currentTarget) setSettled(true);
      }}
      className={cn(visible ? (settled ? undefined : 'animate-fade-up') : 'opacity-0', className)}
    >
      {children}
    </Tag>
  );
}
