import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "squads". Needs an activated account. */
export const squadsApi = {
  /** The club's current squad. */
  actual: () => axiosInstance.get<T.ActualSquadResponse>('squads/actual'),
} as const;
