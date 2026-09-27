import { queryOptions, useQuery } from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

/** One fan club with its owner, members count and your role. */
export const clubQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QueryKey.Clubs, 'one', id],
    queryFn: () => fetcher(clubsApi.one(id)),
    select: (response) => response.club,
  });

export function useClubQuery(id: string) {
  return useQuery(clubQueryOptions(id));
}
