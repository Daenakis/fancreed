import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, predictionsApi } from '@/api';

import { QueryKey } from '@/types';

/** Fans' score picks for a match and the fan's own one (`yourVote`). */
export const predictionQueryOptions = (fixture: number) =>
  queryOptions({
    queryKey: [QueryKey.Predictions, 'fixture', fixture],
    queryFn: () => fetcher(predictionsApi.byFixture(fixture)),
  });

export function usePredictionQuery(fixture: number | undefined) {
  return useQuery({
    ...predictionQueryOptions(fixture ?? 0),
    enabled: fixture !== undefined,
  });
}
