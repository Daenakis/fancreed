import type { AxiosResponse } from 'axios';

import type * as T from '@/types/api';

import { axiosInstance } from '../client';

// TODO(backend): replace with the real endpoint once loyalty points exist.
const MOCK_FAN_LEVEL: T.FanLevel = {
  level: 'bronze',
  points: 700,
  nextLevelPoints: 2000,
  cardId: '38104DL23124',
  season: '2025/2026',
};

/** Backend group "profile". */
export const profileApi = {
  get: () => axiosInstance.get<T.Profile>('profile/'),
  // apidoc lists GET; the old app used POST with a body — keep POST.
  edit: (params: T.EditProfileRequest) =>
    axiosInstance.post<T.Profile>('profile/edit', params),
  setPhoto: (params: T.SetPhotoRequest) =>
    axiosInstance.post<T.Profile>('profile/setphoto', params),
  fanLevel: () =>
    Promise.resolve({ data: MOCK_FAN_LEVEL } as AxiosResponse<T.FanLevel>),
} as const;
