import { Outlet } from 'react-router-dom';

import { useContent } from '@/content';

import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { ScrollManager } from './ScrollManager';

/** Shell for all public marketing pages. Each page starts with a dark hero under the navbar. */
export function PublicLayout() {
  const { common } = useContent();

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        {common.skipToContent}
      </a>
      <ScrollManager />
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
