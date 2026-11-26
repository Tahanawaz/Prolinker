import { useEffect, useRef } from 'react';

/**
 * Thin reading-progress bar along the bottom of the navbar.
 * Updates the DOM directly inside rAF (no React re-render per scroll frame).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-emerald-400 to-accent-400 rtl:origin-right"
      />
    </div>
  );
}
