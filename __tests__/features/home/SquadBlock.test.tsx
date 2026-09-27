import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';

import { squadsApi } from '@/api';

import type { Player } from '@/types/api';

import { SquadBlock } from '@/features/home';

const player = (id: string, ruhLink: string | null): Player => ({
  _id: id,
  _teamId: 3632,
  name: `Player ${id}`,
  actualName: null,
  number: 7,
  position: 'MF',
  photo: `https://x/${id}.png`,
  ruhLink,
});

const mockSquad = (players: Player[]) =>
  jest
    .spyOn(squadsApi, 'actual')
    .mockResolvedValue(apiOk({ squad: { _id: 's', _teamId: 3632, players } }));

describe('SquadBlock', () => {
  it('shows the players and opens the centred one', async () => {
    const first = player('a', 'https://club/players/a');
    mockSquad([first, player('b', null)]);
    const onOpenPlayer = jest.fn();
    const { findByText, getByRole } = render(
      <SquadBlock onOpenPlayer={onOpenPlayer} />,
    );

    expect(await findByText('Player a')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'home.showMore' }));
    expect(onOpenPlayer).toHaveBeenCalledWith(first);
  });

  it('disables Show more when the player has no page', async () => {
    mockSquad([player('a', null)]);
    const { findByRole } = render(<SquadBlock onOpenPlayer={jest.fn()} />);

    expect(
      await findByRole('button', { name: 'home.showMore' }),
    ).toBeDisabled();
  });

  it('renders nothing for an empty squad', async () => {
    mockSquad([]);
    const { toJSON } = render(<SquadBlock onOpenPlayer={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
