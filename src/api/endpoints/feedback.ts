import type { AxiosResponse } from 'axios';

import type * as T from '@/types/api';

/** Feedback to the club — mocked until the backend has an endpoint. */
export const feedbackApi = {
  // TODO(backend): POST the message once an endpoint exists (none in the
  // old or the new backend).
  send: (_params: T.SendFeedbackRequest) =>
    Promise.resolve({ data: undefined } as AxiosResponse<void>),
} as const;
