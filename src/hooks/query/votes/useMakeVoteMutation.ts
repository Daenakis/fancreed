import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { fetcher, votesApi } from '@/api';

import { QueryKey } from '@/types';
import type { MakeVoteRequest } from '@/types/api';

export const makeVoteMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Votes, 'make'],
    mutationFn: (params: MakeVoteRequest) => fetcher(votesApi.make(params)),
  });

/** Votes, then refreshes the list so percentages and `youVoted` update. */
export function useMakeVoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...makeVoteMutationOptions(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKey.Votes] }),
  });
}
