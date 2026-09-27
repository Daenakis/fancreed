import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, profileApi } from '@/api';

import { QueryKey } from '@/types';

/** The signed-in fan's profile. */
export const profileQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Profile, 'self'],
    queryFn: () => fetcher(profileApi.get()),
  });

export function useProfileQuery() {
  return useQuery(profileQueryOptions());
}
