import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "leagues". */
export const leaguesApi = {
  /** Leagues with standings; `index` is the page (0 = first). */
  list: (index = 0) =>
    axiosInstance.get<T.LeaguesListResponse>(`leagues/list/${index}`),
} as const;
