import Env from '@env';
import type { QueryClientConfig } from '@tanstack/react-query';
import * as Device from 'expo-device';

import { shouldRetryQuery } from '@/utils/shouldRetryQuery';

/** A dev build running on a simulator/emulator — test conveniences only. */
const DEV_SIMULATOR = __DEV__ && !Device.isDevice;

export const CONFIG = {
  API_URL: Env.EXPO_PUBLIC_API_URL,
  RUN_MODE: Env.EXPO_PUBLIC_RUN_MODE,
  NAME: Env.EXPO_PUBLIC_NAME,
  VERSION: Env.EXPO_PUBLIC_VERSION,
  /** Dev build on a simulator: test conveniences (never on phones or in store builds). */
  DEV_SIMULATOR,
  /** Dev build on a simulator: test account prefilled in the sign-in form. */
  DEV_SIGN_IN: {
    login: DEV_SIMULATOR ? Env.EXPO_PUBLIC_DEV_LOGIN : '',
    password: DEV_SIMULATOR ? Env.EXPO_PUBLIC_DEV_PASSWORD : '',
  },
  LINKS: {
    /** Club site article: base + post slug (the base alone is the news list). */
    NEWS_POST: 'https://fcruhlviv.com/posts/',
    /** Club site pages opened from the menu. */
    TEAM: 'https://fcruhlviv.com/team/80',
    TEAM_U19: 'https://fcruhlviv.com/team/120',
    ACADEMY: 'https://fcruhlviv.com/academy',
  },
} as const;

export const QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: shouldRetryQuery,
    },
    mutations: {
      retry: 0,
    },
  },
};
