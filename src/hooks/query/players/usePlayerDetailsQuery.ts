import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, playersApi } from '@/api';

import { QueryKey } from '@/types';

/** A player's bio and statistics (mocked until the backend has them). */
export const playerDetailsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QueryKey.Players, 'details', id],
    queryFn: () => fetcher(playersApi.details(id)),
  });

export function usePlayerDetailsQuery(id: string) {
  return useQuery(playerDetailsQueryOptions(id));
}
