import { useQuery } from '@tanstack/react-query';

import { standingsQueryOptions } from './useStandingsQuery';

/** The club's competitions this season (league, cup, friendlies). */
export function useLeaguesQuery() {
  // Same request and cache entry as the standings; only the selection differs.
  return useQuery({
    ...standingsQueryOptions(),
    select: ({ leagues }) => leagues,
  });
}
