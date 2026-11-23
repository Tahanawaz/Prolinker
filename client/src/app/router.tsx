import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/components/layout/RootLayout';

// Route-level code splitting: each page is fetched only when first visited.
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        lazy: () =>
          import('@/pages/public/SetupStatusPage').then((m) => ({ Component: m.default })),
      },
      {
        path: '*',
        lazy: () => import('@/pages/public/NotFoundPage').then((m) => ({ Component: m.default })),
      },
    ],
  },
]);
