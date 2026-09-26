import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { Share } from 'react-native';

import { votesApi } from '@/api';

import type { Vote, VotesListResponse } from '@/types/api';

import { VotesBlock } from '@/features/gamification';

const vote = (id: string, percent: number, finished = false): Vote => ({
  _id: id,
  _teamId: 3632,
  player: {
    _id: `p-${id}`,
    _teamId: 3632,
    name: `Player ${id}`,
    number: 7,
    position: 'MF',
    photo: `https://x/${id}.png`,
  },
  fixture: 1,
  quantity: 1,
  percent,
  total: 10,
  finished,
});

const response = (votes: Vote[], youVoted = false): VotesListResponse => ({
  votes,
  youVoted,
});

describe('VotesBlock', () => {
  it('lets the fan choose the centred player while voting is open', async () => {
    jest
      .spyOn(votesApi, 'list')
      .mockResolvedValue(apiOk(response([vote('a', 60), vote('b', 40)])));
    const make = jest
      .spyOn(votesApi, 'make')
      .mockResolvedValue(apiOk(undefined));
    const { findByRole, queryByText } = render(<VotesBlock />);

    fireEvent.press(await findByRole('button', { name: 'votes.choose' }));

    await waitFor(() => expect(make).toHaveBeenCalledWith({ id: 'a' }));
    expect(queryByText(/60%/)).toBeNull();
  });

  it('shows percentages and a share button once the fan has voted', async () => {
    jest
      .spyOn(votesApi, 'list')
      .mockResolvedValue(apiOk(response([vote('a', 60), vote('b', 40)], true)));
    const share = jest.spyOn(Share, 'share').mockResolvedValue({
      action: 'sharedAction',
    });
    const { findByRole, getByText } = render(
      <VotesBlock homeTeam="Rukh" awayTeam="Vorskla" />,
    );

    fireEvent.press(await findByRole('button', { name: 'votes.share' }));

    expect(getByText('Player a\n60%')).toBeTruthy();
    expect(share).toHaveBeenCalledWith({ message: 'votes.shareMessage' });
  });

  it('shows results when voting is finished even without a vote', async () => {
    jest
      .spyOn(votesApi, 'list')
      .mockResolvedValue(apiOk(response([vote('a', 100, true)])));
    const { findByRole } = render(<VotesBlock />);

    expect(await findByRole('button', { name: 'votes.share' })).toBeTruthy();
  });

  it('renders nothing when there is nothing to vote on', async () => {
    jest.spyOn(votesApi, 'list').mockResolvedValue(apiOk(response([])));
    const { toJSON } = render(<VotesBlock />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
