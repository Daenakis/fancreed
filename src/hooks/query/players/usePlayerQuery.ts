import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, playersApi } from '@/api';

import { QueryKey } from '@/types';

/** One player (name, number, position, photo). */
export const playerQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QueryKey.Players, 'one', id],
    queryFn: () => fetcher(playersApi.one(id)),
    select: (response) => response.player,
  });

export function usePlayerQuery(id: string) {
  return useQuery(playerQueryOptions(id));
}
