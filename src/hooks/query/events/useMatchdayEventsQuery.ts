import { queryOptions, useQuery } from '@tanstack/react-query';

import { eventsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

export const matchdayEventsQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Events, 'matchday', 0],
    queryFn: () => fetcher(eventsApi.matchdayList(0)),
    select: (response) => response.events,
  });

export function useMatchdayEventsQuery() {
  return useQuery(matchdayEventsQueryOptions());
}
