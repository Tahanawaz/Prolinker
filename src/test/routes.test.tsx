import { act, cleanup, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { router } from '@/app/router';
import i18n from '@/i18n';

// Reuse the real route tree with an in-memory history.
const routes = router.routes;

async function renderAt(path: string) {
  const memoryRouter = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={memoryRouter} />);
  // Lazy routes resolve asynchronously; wait for the page's <h1>.
  const heading = await screen.findByRole('heading', { level: 1 }, { timeout: 4000 });
  return { heading, memoryRouter };
}

const PAGES = [
  '/',
  '/services',
  '/for-workers',
  '/tevta',
  '/about',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
  '/login',
  '/signup',
  '/this-page-does-not-exist',
];

describe.each(['en', 'ur'] as const)('public site (%s)', (language) => {
  beforeAll(async () => {
    await act(async () => {
      await i18n.changeLanguage(language);
    });
  });

  afterEach(() => {
    cleanup();
  });

  it.each(PAGES)('renders %s with navbar, h1 and footer', async (path) => {
    const { heading } = await renderAt(path);

    expect(heading.textContent.trim().length).toBeGreaterThan(0);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    // Exactly one h1 per page (SEO / a11y).
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('sets the document direction', () => {
    expect(document.documentElement.dir).toBe(language === 'ur' ? 'rtl' : 'ltr');
    expect(document.documentElement.lang).toBe(language);
  });
});

describe('navbar interactions', () => {
  beforeAll(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('opens the services mega-menu and closes it with Escape', async () => {
    await renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const trigger = within(nav).getByRole('button', { name: /services/i });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    act(() => {
      trigger.click();
    });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(within(nav).getByRole('link', { name: /plumber/i })).toBeTruthy();

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens and closes the mobile menu, locking page scroll', async () => {
    await renderAt('/');
    const toggle = screen.getByRole('button', { name: 'Open menu' });

    act(() => {
      toggle.click();
    });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');

    act(() => {
      screen.getByRole('button', { name: 'Close menu' }).click();
    });
    expect(document.body.style.overflow).toBe('');
  });

  it('closes the mobile menu after navigating', async () => {
    const { memoryRouter } = await renderAt('/');
    act(() => {
      screen.getByRole('button', { name: 'Open menu' }).click();
    });
    await act(async () => {
      await memoryRouter.navigate('/about');
    });
    await screen.findByRole('heading', { level: 1, name: /trusted, visible/i });
    expect(screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });
});
