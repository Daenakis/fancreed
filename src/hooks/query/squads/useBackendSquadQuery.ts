import { queryOptions, useQuery } from '@tanstack/react-query';

import { persistedQuery } from '@/utils';

import { fetcher, squadsApi } from '@/api';

import { QueryKey } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The backend's (api-football) squad, for its headshots; kept on the device
 * for a day.
 */
export const backendSquadQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Squads, 'backend'],
    ...persistedQuery(
      'backendSquad',
      () => fetcher(squadsApi.backend()),
      DAY_MS,
    ),
    select: (response) => response.squad.players,
  });

export function useBackendSquadQuery() {
  return useQuery(backendSquadQueryOptions());
}
