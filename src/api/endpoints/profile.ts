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

/** `GET profile/` populates the favourite player; `edit` returns its id. */
type RawProfile = Omit<T.Profile, 'favoritePlayer'> & {
  favoritePlayer?: number | { _id: number } | null;
};

/** Always hand the app the favourite player's id. */
const normalizeProfile = (
  response: AxiosResponse<RawProfile>,
): AxiosResponse<T.Profile> => {
  const favorite = response.data.favoritePlayer;
  return {
    ...response,
    data: {
      ...response.data,
      favoritePlayer:
        favorite && typeof favorite === 'object' ? favorite._id : favorite,
    },
  };
};

/** Backend group "profile". */
export const profileApi = {
  get: () => axiosInstance.get<RawProfile>('profile/').then(normalizeProfile),
  // apidoc lists GET; the old app used POST with a body — keep POST.
  edit: (params: T.EditProfileRequest) =>
    axiosInstance
      .post<RawProfile>('profile/edit', params)
      .then(normalizeProfile),
  setPhoto: (params: T.SetPhotoRequest) =>
    axiosInstance
      .post<RawProfile>('profile/setphoto', params)
      .then(normalizeProfile),
  fanLevel: () =>
    Promise.resolve({ data: MOCK_FAN_LEVEL } as AxiosResponse<T.FanLevel>),
} as const;
