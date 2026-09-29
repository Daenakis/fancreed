import { queryOptions, useQuery } from '@tanstack/react-query';

import { persistedQuery } from '@/utils';

import { fetcher, squadsApi } from '@/api';

import { QueryKey } from '@/types';

/** The club's current players, kept on the device for a week (club site). */
export const squadQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Squads, 'actual'],
    ...persistedQuery('squad', () => fetcher(squadsApi.actual())),
    select: (response) => response.squad.players,
  });

export function useSquadQuery() {
  return useQuery(squadQueryOptions());
}
