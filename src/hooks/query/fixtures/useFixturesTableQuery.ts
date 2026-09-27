import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, fixturesApi } from '@/api';

import { QueryKey } from '@/types';

/** The season's played and upcoming matches. */
export const fixturesTableQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Fixtures, 'table'],
    queryFn: () => fetcher(fixturesApi.table()),
  });

export function useFixturesTableQuery() {
  return useQuery(fixturesTableQueryOptions());
}

/**
 * Played matches that have a video, newest first.
 * TODO(backend): no videos endpoint yet — built from the fixtures' video links.
 */
export function useMatchVideosQuery() {
  return useQuery({
    ...fixturesTableQueryOptions(),
    select: ({ past }) =>
      past
        .filter((f) => !!f.videoLink)
        .sort((a, b) => b.event_date.localeCompare(a.event_date)),
  });
}
