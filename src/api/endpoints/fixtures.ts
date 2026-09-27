import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "fixtures". */
export const fixturesApi = {
  /** Last played match plus the upcoming ones. */
  actual: () => axiosInstance.get<T.ActualFixturesResponse>('fixtures/actual'),
} as const;
