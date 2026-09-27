import { mutationOptions, useMutation } from '@tanstack/react-query';

import { authApi, fetcher } from '@/api';

import { useAuthStore, useSplashStore } from '@/store';

import type { LoginRequest } from '@/types/api';

export const loginMutationOptions = () =>
  mutationOptions({
    mutationKey: ['auth', 'login'],
    mutationFn: (params: LoginRequest) => fetcher(authApi.login(params)),
    // Only activated accounts get a session; the screen sends the others
    // to email activation.
    onSuccess: async (data) => {
      if (!data.activated) return;
      // The welcome splash covers the switch to the app; a just-activated
      // account is greeted as new.
      const { newAccount, show } = useSplashStore.getState();
      show(newAccount ? 'new' : 'back', 'auth');
      await useAuthStore.getState().signIn(data.access_token);
    },
  });

export function useLoginMutation() {
  return useMutation(loginMutationOptions());
}
