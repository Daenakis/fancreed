import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { fetcher, predictionsApi } from '@/api';

import { QueryKey } from '@/types';
import type { MakePredictionRequest } from '@/types/api';

import { useApiErrorAlert } from '../../useApiErrorAlert';

export const makePredictionMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Predictions, 'make'],
    mutationFn: (params: MakePredictionRequest) =>
      fetcher(predictionsApi.make(params)),
  });

export function useMakePredictionMutation() {
  const queryClient = useQueryClient();
  const onError = useApiErrorAlert();
  const refresh = (fixture: number) =>
    queryClient.invalidateQueries({
      queryKey: [QueryKey.Predictions, 'fixture', fixture],
    });
  return useMutation({
    ...makePredictionMutationOptions(),
    // The pick is saved for the signed-in fan: reload it (and the shares).
    onSuccess: (_, params) => refresh(params.fixture),
    onError: (error, params) => {
      onError(error);
      void refresh(params.fixture);
    },
  });
}
