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

/** Last played match and the next one. */
export const actualFixturesQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Fixtures, 'actual'],
    queryFn: () => fetcher(fixturesApi.actual()),
    select: ({ fixtures }) => ({
      last: fixtures.find((f) => f.status === 'Match Finished') ?? null,
      next: fixtures.find((f) => !MATCH_STARTED_STATUSES.has(f.status)) ?? null,
    }),
  });

export function useActualFixturesQuery() {
  return useQuery(actualFixturesQueryOptions());
}
