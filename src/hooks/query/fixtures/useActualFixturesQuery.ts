import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, fixturesApi } from '@/api';

import { QueryKey } from '@/types';

/** Statuses meaning the match has kicked off — predictions are closed. */
export const MATCH_STARTED_STATUSES = new Set([
  'First Half',
  'Halftime',
  'Second Half',
  'Extra Time',
  'Penalty In Progress',
  'Match Finished',
]);

/** Last played match plus the upcoming ones (one cache entry). */
export const actualFixturesQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Fixtures, 'actual'],
    queryFn: () => fetcher(fixturesApi.actual()),
  });

/** The fixtures in backend order (last played first). */
export function useActualFixturesQuery() {
  return useQuery({
    ...actualFixturesQueryOptions(),
    select: (response) => response.fixtures,
  });
}

/** Last played and next (not started) match. */
export function useNextMatchQuery() {
  return useQuery({
    ...actualFixturesQueryOptions(),
    select: ({ fixtures }) => ({
      last: fixtures.find((f) => f.status === 'Match Finished') ?? null,
      next: fixtures.find((f) => !MATCH_STARTED_STATUSES.has(f.status)) ?? null,
    }),
  });
}
