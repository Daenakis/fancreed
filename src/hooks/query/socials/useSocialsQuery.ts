import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, socialsApi } from '@/api';

import { QueryKey } from '@/types';

/** The club's social links. */
export const socialsQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Socials, 'list', 0],
    queryFn: () => fetcher(socialsApi.list(0)),
    select: (response) => response.socials,
  });

export function useSocialsQuery() {
  return useQuery(socialsQueryOptions());
}
