import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MAX_ATTEMPTS = 10;

/**
 * Scroll to top on page change, or to `#hash` targets (retrying briefly while
 * lazy page content mounts).
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    let attempts = 0;
    let timer = 0;
    const tryScroll = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      attempts += 1;
      if (attempts < MAX_ATTEMPTS) timer = window.setTimeout(tryScroll, 60);
    };
    tryScroll();
    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}
