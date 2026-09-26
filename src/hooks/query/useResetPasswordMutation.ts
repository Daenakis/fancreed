import { useMutation } from '@tanstack/react-query';

import { mockAuthApi } from '@/api';

import type { ResetPasswordRequest } from '@/types/api';

export function useResetPasswordMutation() {
  return useMutation({
    // TODO(backend): mutationFn: (params) => fetcher(api.resetPassword(params)),
    mutationFn: (params: ResetPasswordRequest) =>
      mockAuthApi.resetPassword(params),
  });
}
