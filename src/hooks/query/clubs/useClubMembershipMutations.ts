import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

export const joinClubMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Clubs, 'join'],
    mutationFn: (id: string) => fetcher(clubsApi.join(id)),
  });

export const leaveClubMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Clubs, 'leave'],
    mutationFn: (id: string) => fetcher(clubsApi.leave(id)),
  });

/** Joins an open fan club and refreshes club data. */
export function useJoinClubMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...joinClubMutationOptions(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKey.Clubs] }),
  });
}

/** Leaves a fan club and refreshes club data. */
export function useLeaveClubMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...leaveClubMutationOptions(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKey.Clubs] }),
  });
}
