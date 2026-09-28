import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "news". */
export const newsApi = {
  list: (params: T.NewsListParams) =>
    axiosInstance.get<T.NewsListResponse>('news/list', { params }),
  body: (slug: string) => axiosInstance.get<T.NewsPostBody>(`news/one/${slug}`),
} as const;
