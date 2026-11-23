import { QueryClient } from '@tanstack/react-query';

import { ApiClientError } from '@/lib/api';

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      // Retry transient failures only; 4xx responses won't fix themselves.
      retry: (failureCount, error) => {
        if (error instanceof ApiClientError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < MAX_RETRIES;
      },
    },
    mutations: { retry: false },
  },
});
