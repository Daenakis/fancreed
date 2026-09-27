import { mutationOptions, useMutation } from '@tanstack/react-query';

import { fetcher, predictionsApi } from '@/api';

import { QueryKey } from '@/types';
import type { MakePredictionRequest } from '@/types/api';

export const makePredictionMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Predictions, 'make'],
    mutationFn: (params: MakePredictionRequest) =>
      fetcher(predictionsApi.make(params)),
  });

export function useMakePredictionMutation() {
  return useMutation(makePredictionMutationOptions());
}
