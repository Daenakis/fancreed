import { useMutation } from '@tanstack/react-query';

import { mockAuthApi } from '@/api';

import type { VerifyResetCodeRequest } from '@/types/api';

export function useVerifyResetCodeMutation() {
  return useMutation({
    // TODO(backend): mutationFn: (params) => fetcher(api.verifyResetCode(params)),
    mutationFn: (params: VerifyResetCodeRequest) =>
      mockAuthApi.verifyResetCode(params),
  });
}
