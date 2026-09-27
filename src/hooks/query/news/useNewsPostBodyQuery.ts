import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, newsApi } from '@/api';

import { QueryKey } from '@/types';

/** An article's full text as HTML (mocked until the backend has it). */
export const newsPostBodyQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [QueryKey.News, 'body', slug],
    queryFn: () => fetcher(newsApi.body(slug)),
    select: (response) => response.body,
  });

export function useNewsPostBodyQuery(slug: string) {
  return useQuery(newsPostBodyQueryOptions(slug));
}
