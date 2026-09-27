import { queryOptions, useQuery } from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

/** Events of one fan club (first page). */
export const clubEventListQueryOptions = (clubId: string) =>
  queryOptions({
    queryKey: [QueryKey.Clubs, clubId, 'events', 0],
    queryFn: () => fetcher(clubsApi.events(clubId, 0)),
    select: (response) => response.events,
  });

export function useClubEventListQuery(clubId: string) {
  return useQuery(clubEventListQueryOptions(clubId));
}
