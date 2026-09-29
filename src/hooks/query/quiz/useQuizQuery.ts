import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, quizApi } from '@/api';

import { QueryKey } from '@/types';

/** The current quiz and the fan's result once they've answered. */
export const quizQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Quiz, 'actual'],
    queryFn: () => fetcher(quizApi.actual()),
  });

export function useQuizQuery() {
  return useQuery(quizQueryOptions());
}
