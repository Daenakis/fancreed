import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { fetcher, profileApi } from '@/api';

import { QueryKey } from '@/types';
import type { SetPhotoRequest } from '@/types/api';

export const setPhotoMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Profile, 'setPhoto'],
    mutationFn: (params: SetPhotoRequest) =>
      fetcher(profileApi.setPhoto(params)),
  });

/** Uploads a new profile photo and refreshes the profile. */
export function useSetPhotoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...setPhotoMutationOptions(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKey.Profile] }),
  });
}
