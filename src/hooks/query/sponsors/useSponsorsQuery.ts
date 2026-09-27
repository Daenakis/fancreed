import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, sponsorsApi } from '@/api';

import { QueryKey } from '@/types';

/** All club partners as one flat list. */
export const sponsorsQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Sponsors, 'list', 0],
    queryFn: () => fetcher(sponsorsApi.list(0)),
    select: (response) => response.sponsors.flatMap((group) => group.sponsors),
  });

export function useSponsorsQuery() {
  return useQuery(sponsorsQueryOptions());
}
