import { leagueTitle, rowsAroundTeam, toStandingsRow } from '@/utils';

import type { StandingEntry } from '@/types/api';

const entry: StandingEntry = {
  rank: 2,
  team: { id: 7, name: 'Шахтар', logo: 'https://x/7.png' },
  points: 35,
  goalsDiff: 20,
  all: {
    played: 16,
    win: 10,
    draw: 5,
    lose: 1,
    goals: { for: 30, against: 10 },
  },
};

describe('toStandingsRow', () => {
  it('maps a backend standing to a display row', () => {
    expect(toStandingsRow(entry)).toEqual({
      teamId: 7,
      rank: 2,
      teamName: 'Шахтар',
      teamLogo: 'https://x/7.png',
      played: 16,
      won: 10,
      drawn: 5,
      lost: 1,
      points: 35,
      goalsFor: 30,
      goalsAgainst: 10,
    });
  });
});

describe('rowsAroundTeam', () => {
  const rows = [1, 2, 3, 4, 5].map((teamId) => ({ teamId }));

  it('returns the team with one row above and below', () => {
    expect(rowsAroundTeam(rows, 3)).toEqual([
      { teamId: 2 },
      { teamId: 3 },
      { teamId: 4 },
    ]);
  });

  it('returns fewer rows when the team is first or last', () => {
    expect(rowsAroundTeam(rows, 1)).toEqual([{ teamId: 1 }, { teamId: 2 }]);
    expect(rowsAroundTeam(rows, 5)).toEqual([{ teamId: 4 }, { teamId: 5 }]);
  });

  it('returns nothing when the team is not in the table', () => {
    expect(rowsAroundTeam(rows, 99)).toEqual([]);
  });
});

describe('leagueTitle', () => {
  it('adds the season span', () => {
    expect(leagueTitle('Premier League', 2025)).toBe('Premier League 2025/26');
  });

  it('uses the year alone for friendlies', () => {
    expect(leagueTitle('Friendlies Clubs', 2026)).toBe('Friendlies Clubs 2026');
  });

  it('pads the end year across a century', () => {
    expect(leagueTitle('Cup', 2099)).toBe('Cup 2099/00');
  });
});
