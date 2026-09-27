import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "clubs" (fan clubs). */
export const clubsApi = {
  create: (params: T.CreateClubRequest) =>
    axiosInstance.post<void>('clubs/create', params),
} as const;
