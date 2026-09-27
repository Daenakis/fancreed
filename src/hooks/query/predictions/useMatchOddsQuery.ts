import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, predictionsApi } from '@/api';

import { QueryKey } from '@/types';

/** Sponsor odds for a match (mocked until the backend has them). */
export const matchOddsQueryOptions = (fixture: number) =>
  queryOptions({
    queryKey: [QueryKey.Predictions, 'odds', fixture],
    queryFn: () => fetcher(predictionsApi.odds(fixture)),
  });

export function useMatchOddsQuery(fixture: number | undefined) {
  return useQuery({
    ...matchOddsQueryOptions(fixture ?? 0),
    enabled: fixture !== undefined,
  });
}
