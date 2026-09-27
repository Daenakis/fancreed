import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, quizApi } from '@/api';

import { QueryKey } from '@/types';

/** The current quiz (mocked until the backend has it). */
export const quizQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Quiz, 'current'],
    queryFn: () => fetcher(quizApi.current()),
  });

export function useQuizQuery() {
  return useQuery(quizQueryOptions());
}
