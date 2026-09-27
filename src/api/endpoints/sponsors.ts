import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "sponsors". */
export const sponsorsApi = {
  list: (index = 0) =>
    axiosInstance.get<T.SponsorsListResponse>(`sponsors/list/${index}`),
} as const;
