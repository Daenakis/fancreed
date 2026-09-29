import { queryOptions, useQuery } from '@tanstack/react-query';

import { persistedQuery } from '@/utils';

import { fetcher, playersApi } from '@/api';

import { QueryKey } from '@/types';

/**
 * A player's bio and statistics (club site and transfermarkt), kept on the
 * device for a week.
 */
export const playerDetailsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QueryKey.Players, 'details', id],
    ...persistedQuery(`playerDetails:${id}`, () =>
      fetcher(playersApi.details(id)),
    ),
  });

export function usePlayerDetailsQuery(id: string) {
  return useQuery(playerDetailsQueryOptions(id));
}
