import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';

import { leaguesApi } from '@/api';

import type { LeaguesListResponse, StandingEntry } from '@/types/api';

import { TableBlock } from '@/features/home';

const standing = (id: number, rank: number): StandingEntry => ({
  rank,
  team: { id, name: `Team ${id}`, logo: `https://x/${id}.png` },
  points: 40 - rank,
  goalsDiff: 0,
  all: { played: 16, win: 5, draw: 5, lose: 6 },
});

const response: LeaguesListResponse = {
  leagues: [
    {
      _id: 333,
      _teamId: 30,
      league: { id: 333, name: 'Premier League', logo: '', season: 2025 },
      standings: [[10, 20, 30, 40, 50].map((id, i) => standing(id, i + 1))],
    },
  ],
};

describe('TableBlock', () => {
  it('shows our team with the teams above and below', async () => {
    jest.spyOn(leaguesApi, 'list').mockResolvedValue(apiOk(response));
    const { findByText, queryByText } = render(
      <TableBlock onShowAll={jest.fn()} />,
    );

    expect(await findByText('Team 30')).toBeTruthy();
    expect(queryByText('Team 20')).toBeTruthy();
    expect(queryByText('Team 40')).toBeTruthy();
    expect(queryByText('Team 10')).toBeNull();
  });

  it('opens the full table when the button is pressed', async () => {
    jest.spyOn(leaguesApi, 'list').mockResolvedValue(apiOk(response));
    const onShowAll = jest.fn();
    const { findByRole } = render(<TableBlock onShowAll={onShowAll} />);

    fireEvent.press(await findByRole('button', { name: 'home.allTable' }));

    expect(onShowAll).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when there is no table', async () => {
    jest.spyOn(leaguesApi, 'list').mockResolvedValue(apiOk({ leagues: [] }));
    const { toJSON } = render(<TableBlock onShowAll={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
