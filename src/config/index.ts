import type { QueryClientConfig } from '@tanstack/react-query';
import Env from 'env';

export const CONFIG = {
  API_URL: Env.EXPO_PUBLIC_API_URL,
  RUN_MODE: Env.EXPO_PUBLIC_RUN_MODE,
  NAME: Env.EXPO_PUBLIC_NAME,
  VERSION: Env.EXPO_PUBLIC_VERSION,
} as const;

export const QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 2,
    },
    mutations: {
      retry: 0,
    },
  },
};
