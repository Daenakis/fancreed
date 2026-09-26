import { mutationOptions, useMutation } from '@tanstack/react-query';

import { authApi, fetcher } from '@/api';

import type { ForgotPasswordRequest } from '@/types/api';

/** Emails a password recovery code. */
export const forgotPasswordMutationOptions = () =>
  mutationOptions({
    mutationKey: ['auth', 'forgotPassword'],
    mutationFn: (params: ForgotPasswordRequest) =>
      fetcher(authApi.forgotPassword(params)),
  });

export function useForgotPasswordMutation() {
  return useMutation(forgotPasswordMutationOptions());
}
