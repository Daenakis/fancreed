import { queryOptions, useQuery } from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

/** Fan clubs (first page). */
export const clubsQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Clubs, 'list', 0],
    queryFn: () => fetcher(clubsApi.list(0)),
    select: (response) => response.clubs,
  });

export function useClubsQuery() {
  return useQuery(clubsQueryOptions());
}
