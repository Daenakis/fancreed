import { useMutation } from '@tanstack/react-query';

import { mockAuthApi } from '@/api';

import type { PasswordResetRequest } from '@/types/api';

export function useRequestPasswordResetMutation() {
  return useMutation({
    // TODO(backend): mutationFn: (params) => fetcher(api.requestPasswordReset(params)),
    mutationFn: (params: PasswordResetRequest) =>
      mockAuthApi.requestPasswordReset(params),
  });
}
