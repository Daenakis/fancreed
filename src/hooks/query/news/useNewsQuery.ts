import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, newsApi } from '@/api';

import { QueryKey } from '@/types';

/** Latest news posts (first page). */
export const newsQueryOptions = (number = 10) =>
  queryOptions({
    queryKey: [QueryKey.News, 'list', number],
    queryFn: () => fetcher(newsApi.list({ page: 1, number })),
    select: (response) => response.data,
  });

export function useNewsQuery(number?: number) {
  return useQuery(newsQueryOptions(number));
}
