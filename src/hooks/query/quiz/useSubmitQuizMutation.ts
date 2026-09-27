import { mutationOptions, useMutation } from '@tanstack/react-query';

import { fetcher, quizApi } from '@/api';

import { QueryKey } from '@/types';
import type { QuizAnswers } from '@/types/api';

export const submitQuizMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Quiz, 'submit'],
    mutationFn: (answers: QuizAnswers) => fetcher(quizApi.submit(answers)),
  });

/** Sends the answers and returns the score and rating place. */
export function useSubmitQuizMutation() {
  return useMutation(submitQuizMutationOptions());
}
