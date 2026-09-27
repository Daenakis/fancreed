import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { fetcher, profileApi } from '@/api';

import { QueryKey } from '@/types';
import type { EditProfileRequest } from '@/types/api';

import { profileQueryOptions } from './useProfileQuery';

export const editProfileMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Profile, 'edit'],
    mutationFn: (params: EditProfileRequest) =>
      fetcher(profileApi.edit(params)),
  });

/**
 * Saves profile fields (also the favourite player). The cached profile
 * updates at once and rolls back if the save fails.
 */
export function useEditProfileMutation() {
  const queryClient = useQueryClient();
  const { queryKey } = profileQueryOptions();
  return useMutation({
    ...editProfileMutationOptions(),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      if (previous)
        queryClient.setQueryData(queryKey, { ...previous, ...params });
      return { previous };
    },
    onError: (_error, _params, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKey.Profile] }),
  });
}
