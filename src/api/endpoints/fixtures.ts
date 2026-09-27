import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "fixtures". */
export const fixturesApi = {
  /** Last played match plus the upcoming ones. */
  actual: () => axiosInstance.get<T.ActualFixturesResponse>('fixtures/actual'),
  /** One match with its line-ups. */
  one: (id: number) =>
    axiosInstance.get<T.FixtureResponse>(`fixtures/one/${id}`),
  /** The season split into played and upcoming matches. */
  table: () => axiosInstance.get<T.FixturesTableResponse>('fixtures/table'),
} as const;
