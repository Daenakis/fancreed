import { queryOptions, useQuery } from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

/** One club event with its members count, location and your role. */
export const clubEventQueryOptions = (clubId: string, eventId: string) =>
  queryOptions({
    queryKey: [QueryKey.Clubs, clubId, 'event', eventId],
    queryFn: () => fetcher(clubsApi.event(clubId, eventId)),
    // The apidoc calls the field `events`; accept both.
    select: (response) => response.event ?? response.events ?? null,
  });

export function useClubEventQuery(clubId: string, eventId: string) {
  return useQuery(clubEventQueryOptions(clubId, eventId));
}
