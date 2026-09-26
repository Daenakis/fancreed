import { mutationOptions, useMutation } from '@tanstack/react-query';

import { authApi, fetcher } from '@/api';

import type { ResendCodeRequest } from '@/types/api';

/** Emails a new activation code. */
export const resendActivationCodeMutationOptions = () =>
  mutationOptions({
    mutationKey: ['auth', 'resendCode'],
    mutationFn: (params: ResendCodeRequest) =>
      fetcher(authApi.resendActivationCode(params)),
  });

export function useResendActivationCodeMutation() {
  return useMutation(resendActivationCodeMutationOptions());
}
