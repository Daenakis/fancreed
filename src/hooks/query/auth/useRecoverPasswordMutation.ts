import { mutationOptions, useMutation } from '@tanstack/react-query';

import { authApi, fetcher } from '@/api';

import type { RecoverPasswordRequest } from '@/types/api';

/** Sets a new password with the emailed recovery code. */
export const recoverPasswordMutationOptions = () =>
  mutationOptions({
    mutationKey: ['auth', 'recoverPassword'],
    mutationFn: (params: RecoverPasswordRequest) =>
      fetcher(authApi.recoverPassword(params)),
  });

export function useRecoverPasswordMutation() {
  return useMutation(recoverPasswordMutationOptions());
}
