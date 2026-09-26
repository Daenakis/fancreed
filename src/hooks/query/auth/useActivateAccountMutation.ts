import { mutationOptions, useMutation } from '@tanstack/react-query';

import { authApi, fetcher } from '@/api';

import type { ActivateRequest } from '@/types/api';

/** Confirms the email with the 4-digit activation code. */
export const activateAccountMutationOptions = () =>
  mutationOptions({
    mutationKey: ['auth', 'activate'],
    mutationFn: (params: ActivateRequest) => fetcher(authApi.activate(params)),
  });

export function useActivateAccountMutation() {
  return useMutation(activateAccountMutationOptions());
}
