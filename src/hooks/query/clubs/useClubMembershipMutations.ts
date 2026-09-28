import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';

import { useApiErrorAlert } from '../../useApiErrorAlert';
import { refreshClubData } from './refreshClubData';

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

/** Joins an open fan club and refreshes club and event data. */
export function useJoinClubMutation() {
  const onError = useApiErrorAlert();
  const queryClient = useQueryClient();
  return useMutation({
    ...joinClubMutationOptions(),
    onError,
    onSuccess: () => refreshClubData(queryClient),
  });
}

/** Leaves a fan club and refreshes club and event data. */
export function useLeaveClubMutation() {
  const onError = useApiErrorAlert();
  const queryClient = useQueryClient();
  return useMutation({
    ...leaveClubMutationOptions(),
    onError,
    onSuccess: () => refreshClubData(queryClient),
  });
}
