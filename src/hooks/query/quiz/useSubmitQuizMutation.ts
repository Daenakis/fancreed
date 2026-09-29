import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { fetcher, quizApi } from '@/api';

import { QueryKey } from '@/types';
import type { QuizAnswerRequest, QuizResponse } from '@/types/api';

import { useApiErrorAlert } from '../../useApiErrorAlert';

export const submitQuizMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Quiz, 'answer'],
    mutationFn: (params: QuizAnswerRequest) => fetcher(quizApi.answer(params)),
  });

/** Sends the answers; the result then shows from the quiz query. */
export function useSubmitQuizMutation() {
  const queryClient = useQueryClient();
  const onError = useApiErrorAlert();
  return useMutation({
    ...submitQuizMutationOptions(),
    onSuccess: ({ result }) =>
      queryClient.setQueryData<QuizResponse>(
        [QueryKey.Quiz, 'actual'],
        (old) => old && { ...old, yourResult: result },
      ),
    onError: (error) => {
      onError(error);
      // e.g. answered on another device: show that result.
      void queryClient.invalidateQueries({ queryKey: [QueryKey.Quiz] });
    },
  });
}
