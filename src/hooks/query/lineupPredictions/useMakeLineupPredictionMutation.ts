import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { fetcher, lineupPredictionsApi } from '@/api';

import { QueryKey } from '@/types';
import type { MakeLineupPredictionRequest } from '@/types/api';

import { useApiErrorAlert } from '../../useApiErrorAlert';

export const makeLineupPredictionMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.LineupPredictions, 'make'],
    mutationFn: (params: MakeLineupPredictionRequest) =>
      fetcher(lineupPredictionsApi.make(params)),
  });

export function useMakeLineupPredictionMutation() {
  const queryClient = useQueryClient();
  const onError = useApiErrorAlert();
  return useMutation({
    ...makeLineupPredictionMutationOptions(),
    onError: (error, params) => {
      onError(error);
      // e.g. already made on another device: show the saved one.
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.LineupPredictions, 'fixture', params.fixture],
      });
    },
    onSuccess: (response, params) =>
      queryClient.setQueryData(
        [QueryKey.LineupPredictions, 'fixture', params.fixture],
        response,
      ),
  });
}
