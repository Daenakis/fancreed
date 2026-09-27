import { apiOk, fireEvent, render } from '@tests/test-utils';

import { fixturesApi, leaguesApi } from '@/api';

import type { Fixture, League } from '@/types/api';

import { TournamentScreen } from '@/features/tournament';

const entry = (id: number, rank: number) => ({
  rank,
  team: { id, name: `Team ${id}`, logo: '' },
  points: 10,
  goalsDiff: 0,
  all: { played: 5, win: 3, draw: 1, lose: 1, goals: { for: 9, against: 4 } },
});

const league = (
  id: number,
  name: string,
  standings: ReturnType<typeof entry>[],
): League => ({
  _id: id,
  _teamId: 1,
  league: { id, name, logo: '', season: 2025 },
  standings: standings.length ? [standings] : [],
});

const match = (id: number, leagueId: number): Fixture => ({
  _id: id,
  _teamId: 1,
  event_date: '2026-03-01T16:00:00+00:00',
  status: 'Match Finished',
  homeTeam: { id: 1, name: `Home ${id}`, logo: '' },
  awayTeam: { id: 2, name: `Away ${id}`, logo: '' },
  goalsHomeTeam: 1,
  goalsAwayTeam: 0,
  league: { id: leagueId, name: 'L', logo: '', round: '' },
  round: '',
});

beforeEach(() => {
  jest.spyOn(leaguesApi, 'list').mockResolvedValue(
    apiOk({
      leagues: [
        league(667, 'Friendlies Clubs', []),
        league(333, 'Premier League', [entry(1, 1), entry(2, 2)]),
      ],
    }),
  );
  jest
    .spyOn(fixturesApi, 'table')
    .mockResolvedValue(
      apiOk({ past: [match(1, 333), match(2, 667)], future: [] }),
    );
});

describe('TournamentScreen', () => {
  it('opens on the league that has a table', async () => {
    const { findAllByText, getByRole } = render(<TournamentScreen />);

    expect(await findAllByText('9-4')).toHaveLength(2);
    expect(
      getByRole('button', { name: 'tournament.league' }).props
        .accessibilityValue,
    ).toEqual({
      text: 'Premier League 2025/26',
    });
  });

  it('lists only the picked league matches on the fixtures tab', async () => {
    const { findByRole, getByLabelText, queryByLabelText } = render(
      <TournamentScreen />,
    );

    fireEvent.press(await findByRole('tab', { name: 'tournament.calendar' }));

    expect(getByLabelText('Home 1')).toBeTruthy();
    expect(queryByLabelText('Home 2')).toBeNull();
  });
});
