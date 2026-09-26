import { mutationOptions, useMutation } from '@tanstack/react-query';

import { authApi, fetcher } from '@/api';

import type { RegistrationRequest } from '@/types/api';

/** Creates an account; it must then be activated with the emailed code. */
export const registerMutationOptions = () =>
  mutationOptions({
    mutationKey: ['auth', 'register'],
    mutationFn: (params: RegistrationRequest) =>
      fetcher(authApi.register(params)),
  });

export function useRegisterMutation() {
  return useMutation(registerMutationOptions());
}
