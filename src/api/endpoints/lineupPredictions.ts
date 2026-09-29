import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "lineupPredictions": the fan's line-up for a match. */
export const lineupPredictionsApi = {
  byFixture: (fixtureId: number) =>
    axiosInstance.get<T.LineupPredictionResponse>(
      `lineupPredictions/fixture/${fixtureId}`,
    ),
  make: (params: T.MakeLineupPredictionRequest) =>
    axiosInstance.post<T.LineupPredictionResponse>(
      'lineupPredictions/make',
      params,
    ),
} as const;
