import type { AxiosResponse } from 'axios';

import type * as T from '@/types/api';

import { axiosInstance } from '../client';

// TODO(backend): replace with the real odds endpoint.
const MOCK_ODDS: T.MatchOdds = {
  sponsor: 'FAVBET',
  odds: [
    { label: 'X2', value: '1,45' },
    { label: '1:2', value: '8,6' },
    { label: 'П2', value: '3,1' },
  ],
};

/** Backend group "predictions". */
export const predictionsApi = {
  // apidoc lists GET, the old app used POST with a body — keep POST.
  make: (params: T.MakePredictionRequest) =>
    axiosInstance.post<void>('predictions/make', params),
  odds: (_fixture: number) =>
    Promise.resolve({ data: MOCK_ODDS } as AxiosResponse<T.MatchOdds>),
} as const;
