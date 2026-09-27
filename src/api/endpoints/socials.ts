import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "socials". */
export const socialsApi = {
  list: (index = 0) =>
    axiosInstance.get<T.SocialsListResponse>(`socials/list/${index}`),
} as const;
