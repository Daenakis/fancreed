import { queryOptions, useQuery } from '@tanstack/react-query';

import { eventsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

/** Fan-club events (first page). */
export const clubEventsQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Events, 'club', 0],
    queryFn: () => fetcher(eventsApi.clubList(0)),
    select: (response) => response.events,
  });

export function useClubEventsQuery() {
  return useQuery(clubEventsQueryOptions());
}
