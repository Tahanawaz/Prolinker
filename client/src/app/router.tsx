import { createBrowserRouter } from 'react-router-dom';

import { PublicLayout } from '@/components/layout/PublicLayout';

// Route-level code splitting: each page is fetched only when first visited.
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/public/HomePage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'services',
        lazy: () => import('@/pages/public/ServicesPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'for-workers',
        lazy: () => import('@/pages/public/ForWorkersPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'tevta',
        lazy: () => import('@/pages/public/TevtaPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'about',
        lazy: () => import('@/pages/public/AboutPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'faq',
        lazy: () => import('@/pages/public/FaqPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'contact',
        lazy: () => import('@/pages/public/ContactPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'privacy',
        lazy: () => import('@/pages/public/LegalPage').then((m) => ({ Component: m.PrivacyPage })),
      },
      {
        path: 'terms',
        lazy: () => import('@/pages/public/LegalPage').then((m) => ({ Component: m.TermsPage })),
      },
      {
        path: 'login',
        lazy: () =>
          import('@/pages/public/AuthPlaceholderPage').then((m) => ({ Component: m.LoginPage })),
      },
      {
        path: 'signup',
        lazy: () =>
          import('@/pages/public/AuthPlaceholderPage').then((m) => ({ Component: m.SignupPage })),
      },
      {
        path: '*',
        lazy: () => import('@/pages/public/NotFoundPage').then((m) => ({ Component: m.default })),
      },
    ],
  },
]);
