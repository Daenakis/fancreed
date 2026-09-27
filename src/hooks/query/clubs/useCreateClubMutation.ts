import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';
import type { CreateClubRequest } from '@/types/api';

export const createClubMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Clubs, 'create'],
    mutationFn: (params: CreateClubRequest) => fetcher(clubsApi.create(params)),
  });

/** Creates a fan club and refreshes club lists. */
export function useCreateClubMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...createClubMutationOptions(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKey.Clubs] }),
  });
}
