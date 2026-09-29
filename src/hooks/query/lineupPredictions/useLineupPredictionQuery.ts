import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, lineupPredictionsApi } from '@/api';

import { QueryKey } from '@/types';

/** The fan's own line-up prediction for a match (`null` until made). */
export const lineupPredictionQueryOptions = (fixtureId: number) =>
  queryOptions({
    queryKey: [QueryKey.LineupPredictions, 'fixture', fixtureId],
    queryFn: () => fetcher(lineupPredictionsApi.byFixture(fixtureId)),
    select: (response) => response.prediction,
  });

export function useLineupPredictionQuery(fixtureId: number | undefined) {
  return useQuery({
    ...lineupPredictionQueryOptions(fixtureId ?? 0),
    enabled: !!fixtureId,
  });
}
