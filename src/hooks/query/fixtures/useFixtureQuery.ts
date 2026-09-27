import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, fixturesApi } from '@/api';

import { QueryKey } from '@/types';

/** One match with its line-ups. */
export const fixtureQueryOptions = (id: number) =>
  queryOptions({
    queryKey: [QueryKey.Fixtures, 'one', id],
    queryFn: () => fetcher(fixturesApi.one(id)),
    select: (response) => response.fixture,
  });

export function useFixtureQuery(id: number) {
  return useQuery(fixtureQueryOptions(id));
}
