import { mutationOptions, useMutation } from '@tanstack/react-query';

import { authApi, fetcher } from '@/api';

import { useAuthStore } from '@/store';

export const logoutMutationOptions = () =>
  mutationOptions({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => fetcher(authApi.logout()),
    // Sign out locally even if the server call fails (offline, expired token).
    onSettled: () => useAuthStore.getState().signOut(),
  });

export function useLogoutMutation() {
  return useMutation(logoutMutationOptions());
}
