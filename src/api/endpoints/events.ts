import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "events". */
export const eventsApi = {
  /** Matchday events; `index` is the page. */
  matchdayList: (index = 0) =>
    axiosInstance.get<T.EventsListResponse>(`events/matchday/list/${index}`),

  /** Fan-club events; `index` is the page. */
  clubList: (index = 0) =>
    axiosInstance.get<T.ClubEventsListResponse>(`events/club/list/${index}`),
} as const;
