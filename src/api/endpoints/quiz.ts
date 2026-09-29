import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "quizzes": the current quiz and the fan's result. */
export const quizApi = {
  actual: () => axiosInstance.get<T.QuizResponse>('quizzes/actual'),
  answer: (params: T.QuizAnswerRequest) =>
    axiosInstance.post<T.QuizAnswerResponse>('quizzes/answer', params),
} as const;
