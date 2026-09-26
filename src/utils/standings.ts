import type { StandingsRowData } from '@/ui/components';

import type { StandingEntry } from '@/types/api';

/** Backend standing → display row for StandingsTable. */
export function toStandingsRow(entry: StandingEntry): StandingsRowData {
  return {
    teamId: entry.team.id,
    rank: entry.rank,
    teamName: entry.team.name,
    teamLogo: entry.team.logo,
    played: entry.all.played,
    won: entry.all.win,
    drawn: entry.all.draw,
    lost: entry.all.lose,
    points: entry.points,
  };
}

/**
 * The team's row with `radius` rows above and below (fewer at the top or
 * bottom of the table). Empty when the team isn't in the table.
 */
export function rowsAroundTeam<T extends { teamId: number }>(
  rows: T[],
  teamId: number,
  radius = 1,
): T[] {
  const index = rows.findIndex((row) => row.teamId === teamId);
  if (index === -1) return [];
  return rows.slice(Math.max(0, index - radius), index + radius + 1);
}
