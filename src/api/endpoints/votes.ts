import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "votes" (player of the match). */
export const votesApi = {
  /** Candidates for the current match; `index` is the page. */
  list: (index = 0) =>
    axiosInstance.get<T.VotesListResponse>(`votes/list/${index}`),

  make: (params: T.MakeVoteRequest) =>
    axiosInstance.post<void>('votes/make', params),
} as const;
