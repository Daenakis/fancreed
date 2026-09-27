import { fireEvent, render } from '@tests/test-utils';
import { Share } from 'react-native';

import type { Fixture } from '@/types/api';

import { MatchCard } from '@/features/matches';

const match = (overrides: Partial<Fixture>): Fixture => ({
  _id: 1,
  _teamId: 3632,
  event_date: '2030-10-01T16:00:00+00:00',
  status: 'Not Started',
  homeTeam: { id: 3632, name: 'Rukh', logo: 'https://x/h.png' },
  awayTeam: { id: 10, name: 'Vorskla', logo: 'https://x/a.png' },
  goalsHomeTeam: null,
  goalsAwayTeam: null,
  league: { id: 333, name: 'UPL', logo: 'https://x/l.png', round: '' },
  round: 'Regular Season - 19',
  ...overrides,
});

describe('MatchCard compact', () => {
  it('shows team names and the date before kick-off, with tickets and share', () => {
    const onOpenLink = jest.fn();
    const { getByText, getByRole, queryByLabelText } = render(
      <MatchCard
        variant="compact"
        match={match({ ticketLink: 'https://club/t' })}
        onOpenLink={onOpenLink}
      />,
    );

    expect(getByText('Rukh')).toBeTruthy();
    expect(getByText('Vorskla')).toBeTruthy();
    expect(queryByLabelText('match.score')).toBeNull();
    fireEvent.press(getByRole('button', { name: 'match.tickets' }));
    expect(onOpenLink).toHaveBeenCalledWith('https://club/t');
  });

  it('shows the score and video after the match', () => {
    const onOpenLink = jest.fn();
    const { getByLabelText, getByRole, queryByRole } = render(
      <MatchCard
        variant="compact"
        match={match({
          status: 'Match Finished',
          goalsHomeTeam: 2,
          goalsAwayTeam: 1,
          videoLink: 'https://yt/v',
          ticketLink: 'https://club/t',
        })}
        onOpenLink={onOpenLink}
      />,
    );

    expect(getByLabelText('match.score')).toBeTruthy();
    expect(queryByRole('button', { name: 'match.tickets' })).toBeNull();
    fireEvent.press(getByRole('button', { name: 'match.video' }));
    expect(onOpenLink).toHaveBeenCalledWith('https://yt/v');
  });

  it('shares the match', () => {
    const share = jest
      .spyOn(Share, 'share')
      .mockResolvedValue({ action: 'sharedAction' });
    const { getByRole } = render(
      <MatchCard variant="compact" match={match({})} onOpenLink={jest.fn()} />,
    );

    fireEvent.press(getByRole('button', { name: 'match.share' }));

    expect(share).toHaveBeenCalledWith({ message: 'match.shareMessage' });
  });
});
