import { apiOk, fireEvent, render } from '@tests/test-utils';
import { router, useLocalSearchParams } from 'expo-router';

import { fixturesApi } from '@/api';

import type { Fixture, LineupPlayer } from '@/types/api';

import { LineupScreen } from '@/features/matches';

const player = (id: string, grid: string): LineupPlayer => ({
  _id: id,
  _teamId: 3632,
  name: `Player ${id}`,
  number: Number(id),
  position: 'M',
  photo: '',
  grid,
});

const match = (overrides: Partial<Fixture>): Fixture => ({
  _id: 7,
  _teamId: 3632,
  event_date: '2026-03-01T16:00:00+00:00',
  status: 'Match Finished',
  homeTeam: { id: 3632, name: 'Rukh', logo: '' },
  awayTeam: { id: 10, name: 'Vorskla', logo: '' },
  goalsHomeTeam: 1,
  goalsAwayTeam: 0,
  league: { id: 1, name: 'UPL', logo: '', round: '' },
  round: '',
  ...overrides,
});

const mockFixture = (fixture: Fixture) =>
  jest.spyOn(fixturesApi, 'one').mockResolvedValue(apiOk({ fixture }));

beforeEach(() => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: '7' });
});

describe('LineupScreen', () => {
  it('shows our starting XI and opens a tapped player', async () => {
    mockFixture(
      match({
        lineups: [
          {
            team: { id: 10, name: 'Vorskla', logo: '' },
            startXI: [player('99', '1:1')],
          },
          {
            team: { id: 3632, name: 'Rukh', logo: '' },
            startXI: [player('1', '1:1'), player('9', '2:1')],
          },
        ],
      }),
    );
    const { findByRole, queryByLabelText } = render(<LineupScreen />);

    fireEvent.press(await findByRole('button', { name: 'Player 9, 9' }));

    expect(queryByLabelText('Player 99, 99')).toBeNull();
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/players/[id]',
      params: { id: '9' },
    });
  });

  it('shows the empty state before the line-up is announced', async () => {
    mockFixture(match({ status: 'Not Started', lineups: [] }));
    const { findByText } = render(<LineupScreen />);

    expect(await findByText('lineup.emptyTitle')).toBeTruthy();
  });
});
