import { queryOptions, useQuery } from '@tanstack/react-query';

import { toStandingsRow } from '@/utils';

import { fetcher, leaguesApi } from '@/api';

import { QueryKey } from '@/types';

/** Our club's league table, ready for StandingsTable. */
export const standingsQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Leagues, 'list', 0],
    queryFn: () => fetcher(leaguesApi.list(0)),
    select: ({ leagues }) => {
      // The first league with a table is the club's main competition.
      const league = leagues.find((l) => l.standings[0]?.length);
      if (!league) return null;
      return {
        leagueName: league.league.name,
        ourTeamId: league._teamId,
        rows: league.standings[0]!.map(toStandingsRow),
      };
    },
  });

export function useStandingsQuery() {
  return useQuery(standingsQueryOptions());
}
