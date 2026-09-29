import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';

import { fixturesApi, lineupPredictionsApi, squadsApi } from '@/api';

import type { Fixture, LineupPrediction, Player } from '@/types/api';

import { LineupPredictionBlock } from '@/features/gamification';

const player = (id: string): Player => ({
  _id: id,
  _teamId: 1,
  name: `Player ${id}`,
  number: Number(id),
  position: 'Midfielder',
  photo: `https://club/${id}.png`,
});

const match = (status: string): Fixture => ({
  _id: 77,
  _teamId: 1,
  event_date: '2026-10-02T16:00:00+00:00',
  status,
  homeTeam: { id: 1, name: 'Us', logo: 'https://x/1.png' },
  awayTeam: { id: 2, name: 'Them', logo: 'https://x/2.png' },
  goalsHomeTeam: null,
  goalsAwayTeam: null,
  league: { id: 3, name: 'L', logo: 'https://x/l.png', round: '1' },
  round: 'Round 1',
});

const saved: LineupPrediction = {
  _id: 'p',
  _teamId: 1,
  fixture: 77,
  formation: '4-4-2',
  players: [{ grid: '1:1', name: 'Keeper One', number: 1 }],
};

const squad = Array.from({ length: 12 }, (_, i) => player(String(i + 1)));

const setup = ({
  status = 'Not Started',
  prediction = null as LineupPrediction | null,
} = {}) => {
  jest
    .spyOn(fixturesApi, 'actual')
    .mockResolvedValue(apiOk({ fixtures: [match(status)] }));
  jest
    .spyOn(squadsApi, 'actual')
    .mockResolvedValue(
      apiOk({ squad: { _id: 's', _teamId: 1, players: squad } }),
    );
  jest
    .spyOn(squadsApi, 'backend')
    .mockResolvedValue(apiOk({ squad: { _id: 'b', _teamId: 1, players: [] } }));
  jest
    .spyOn(lineupPredictionsApi, 'byFixture')
    .mockResolvedValue(apiOk({ prediction }));
  return render(<LineupPredictionBlock />);
};

const pickFormation = async (utils: ReturnType<typeof render>) => {
  fireEvent.press(
    await utils.findByRole('button', { name: 'lineupPrediction.formation' }),
  );
  fireEvent.press(utils.getByText('4-4-2'));
};

describe('LineupPredictionBlock', () => {
  it('shows eleven empty places after picking a formation', async () => {
    const utils = setup();
    await pickFormation(utils);

    expect(
      await utils.findAllByRole('button', {
        name: 'lineupPrediction.pickPlayer',
      }),
    ).toHaveLength(11);
    expect(
      utils.getByRole('button', { name: 'lineupPrediction.vote' }),
    ).toBeDisabled();
  });

  it('places the picked player and hides them from other places', async () => {
    const utils = setup();
    await pickFormation(utils);

    fireEvent.press(
      (
        await utils.findAllByRole('button', {
          name: 'lineupPrediction.pickPlayer',
        })
      )[0]!,
    );
    fireEvent.press(utils.getByRole('button', { name: 'Player 1' }));

    expect(utils.getByRole('button', { name: 'Player 1, 1' })).toBeTruthy();
    fireEvent.press(
      (
        await utils.findAllByRole('button', {
          name: 'lineupPrediction.pickPlayer',
        })
      )[0]!,
    );
    expect(utils.queryByRole('button', { name: 'Player 1' })).toBeNull();
  });

  it('saves the full line-up for the next match when voting', async () => {
    const make = jest
      .spyOn(lineupPredictionsApi, 'make')
      .mockResolvedValue(apiOk({ prediction: saved }));
    const utils = setup();
    await pickFormation(utils);

    for (let i = 1; i <= 11; i += 1) {
      fireEvent.press(
        (
          await utils.findAllByRole('button', {
            name: 'lineupPrediction.pickPlayer',
          })
        )[0]!,
      );
      fireEvent.press(utils.getByRole('button', { name: `Player ${i}` }));
    }
    fireEvent.press(
      utils.getByRole('button', { name: 'lineupPrediction.vote' }),
    );

    await waitFor(() => expect(make).toHaveBeenCalledTimes(1));
    const params = make.mock.calls[0]![0];
    expect(params.fixture).toBe(77);
    expect(params.formation).toBe('4-4-2');
    expect(params.players).toHaveLength(11);
    expect(new Set(params.players.map((p) => p.grid)).size).toBe(11);
    expect(await utils.findByText('lineupPrediction.yours')).toBeTruthy();
  });

  it('shows the saved line-up collapsed with Share instead of the picker', async () => {
    const utils = setup({ prediction: saved });

    const toggle = await utils.findByRole('button', {
      name: 'lineupPrediction.yours, 4-4-2',
    });
    expect(toggle).toHaveProp('accessibilityState', { expanded: false });
    expect(utils.queryByLabelText('Keeper One, 1')).toBeNull();
    expect(utils.getByRole('button', { name: 'votes.share' })).toBeTruthy();
    expect(
      utils.queryByRole('button', { name: 'lineupPrediction.formation' }),
    ).toBeNull();
  });

  it('opens the saved line-up on the pitch when the row is pressed', async () => {
    const utils = setup({ prediction: saved });

    fireEvent.press(
      await utils.findByRole('button', {
        name: 'lineupPrediction.yours, 4-4-2',
      }),
    );

    expect(utils.getByLabelText('Keeper One, 1')).toBeTruthy();
  });

  it('renders nothing when there is no upcoming match', async () => {
    const utils = setup({ status: 'Match Finished' });

    await waitFor(() => expect(utils.toJSON()).toBeNull());
  });
});
