import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, squadsApi } from '@/api';

import { QueryKey } from '@/types';

/** The club's current players. */
export const squadQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Squads, 'actual'],
    queryFn: () => fetcher(squadsApi.actual()),
    select: (response) => response.squad.players,
  });

export function useSquadQuery() {
  return useQuery(squadQueryOptions());
}
