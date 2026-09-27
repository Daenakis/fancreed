import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, profileApi } from '@/api';

import { QueryKey } from '@/types';

/** Loyalty level and points for the fan card (mocked until the backend has it). */
export const fanLevelQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Profile, 'fanLevel'],
    queryFn: () => fetcher(profileApi.fanLevel()),
  });

export function useFanLevelQuery() {
  return useQuery(fanLevelQueryOptions());
}
