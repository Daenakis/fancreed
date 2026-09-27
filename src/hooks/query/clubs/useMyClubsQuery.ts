import { queryOptions, useQuery } from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

/** Clubs the fan owns or belongs to (first page). */
export const myClubsQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Clubs, 'self', 0],
    queryFn: () => fetcher(clubsApi.self(0)),
    select: (response) => response.clubs,
  });

export function useMyClubsQuery() {
  return useQuery(myClubsQueryOptions());
}
