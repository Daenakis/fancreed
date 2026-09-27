import { apiOk, fireEvent, render } from '@tests/test-utils';

import { squadsApi } from '@/api';

import type { Player } from '@/types/api';

import { LineupPredictionBlock } from '@/features/gamification';

const player = (id: string): Player => ({
  _id: id,
  _teamId: 1,
  name: `Player ${id}`,
  number: Number(id),
  position: 'Midfielder',
  photo: '',
});

beforeEach(() => {
  jest.spyOn(squadsApi, 'actual').mockResolvedValue(
    apiOk({
      squad: { _id: 's', _teamId: 1, players: [player('1'), player('2')] },
    }),
  );
});

describe('LineupPredictionBlock', () => {
  it('shows eleven empty places after picking a formation', async () => {
    const { getByRole, getByText, findAllByRole } = render(
      <LineupPredictionBlock />,
    );

    fireEvent.press(
      getByRole('button', { name: 'lineupPrediction.formation' }),
    );
    fireEvent.press(getByText('4-4-2'));

    expect(
      await findAllByRole('button', { name: 'lineupPrediction.pickPlayer' }),
    ).toHaveLength(11);
    expect(
      getByRole('button', { name: 'lineupPrediction.vote' }),
    ).toBeDisabled();
  });

  it('places the picked player and hides them from other places', async () => {
    const { getByRole, getByText, findAllByRole, queryByRole } = render(
      <LineupPredictionBlock />,
    );
    fireEvent.press(
      getByRole('button', { name: 'lineupPrediction.formation' }),
    );
    fireEvent.press(getByText('4-4-2'));

    fireEvent.press(
      (
        await findAllByRole('button', { name: 'lineupPrediction.pickPlayer' })
      )[0]!,
    );
    fireEvent.press(getByRole('button', { name: 'Player 1' }));

    expect(getByRole('button', { name: 'Player 1, 1' })).toBeTruthy();
    fireEvent.press(
      (
        await findAllByRole('button', { name: 'lineupPrediction.pickPlayer' })
      )[0]!,
    );
    expect(queryByRole('button', { name: 'Player 1' })).toBeNull();
  });
});
