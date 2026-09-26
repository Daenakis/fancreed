import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetcher, votesApi } from '@/api';

import { QueryKey } from '@/types';

/** Player-of-the-match candidates for the current match. */
export const votesQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Votes, 'list', 0],
    queryFn: () => fetcher(votesApi.list(0)),
  });

export function useVotesQuery() {
  return useQuery(votesQueryOptions());
}
