import type { QueryClient } from '@tanstack/react-query';

import { QueryKey } from '@/types';

/**
 * Refetches everything a club change can affect: the clubs themselves and
 * their event lists, and the app-wide event lists (Fan centre "Fan events",
 * the calendar's match events), which live under a separate key.
 */
export const refreshClubData = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: [QueryKey.Clubs] }),
    queryClient.invalidateQueries({ queryKey: [QueryKey.Events] }),
  ]);
