import type { AxiosResponse } from 'axios';

import type * as T from '@/types/api';

import { axiosInstance } from '../client';

// TODO(backend): replace with real player bio + statistics.
const MOCK_DETAILS: T.PlayerDetails = {
  birthday: '1998-11-10',
  nationality: 'Українець',
  height: 185,
  weight: 72,
  season: '2024/2025',
  matches: { total: 43, season: 20 },
  goals: { total: 8, season: 3 },
  assists: { total: 10, season: 3 },
};

/** Backend group "players". */
export const playersApi = {
  one: (id: string) => axiosInstance.get<T.PlayerResponse>(`players/one/${id}`),
  details: (_id: string) =>
    Promise.resolve({ data: MOCK_DETAILS } as AxiosResponse<T.PlayerDetails>),
} as const;
