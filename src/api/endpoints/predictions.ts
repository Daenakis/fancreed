import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "predictions". */
export const predictionsApi = {
  // apidoc lists GET, the old app used POST with a body — keep POST.
  make: (params: T.MakePredictionRequest) =>
    axiosInstance.post<void>('predictions/make', params),
} as const;
