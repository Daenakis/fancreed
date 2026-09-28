import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, newsApi } from '@/api';

import { QueryKey } from '@/types';

/** One article: text as HTML (or a video link), title, lead and image. */
export const newsPostBodyQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [QueryKey.News, 'body', slug],
    queryFn: () => fetcher(newsApi.body(slug)),
  });

export function useNewsPostBodyQuery(slug: string) {
  return useQuery(newsPostBodyQueryOptions(slug));
}
