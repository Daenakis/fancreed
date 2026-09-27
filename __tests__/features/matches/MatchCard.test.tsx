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
  it('shows the crests and date before kick-off and opens tickets', () => {
    const onOpenLink = jest.fn();
    const { getByLabelText, getByRole, queryByLabelText } = render(
      <MatchCard
        variant="compact"
        match={match({ ticketLink: 'https://club/t' })}
        onOpenLink={onOpenLink}
      />,
    );

    expect(getByLabelText('Rukh')).toBeTruthy();
    expect(getByLabelText('Vorskla')).toBeTruthy();
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

  it('opens the events of the match and disables them without a handler', () => {
    const onOpenEvents = jest.fn();
    const m = match({});
    const { getByRole, rerender } = render(
      <MatchCard
        variant="compact"
        match={m}
        onOpenLink={jest.fn()}
        onOpenEvents={onOpenEvents}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'match.events' }));
    expect(onOpenEvents).toHaveBeenCalledWith(m);

    rerender(<MatchCard variant="compact" match={m} onOpenLink={jest.fn()} />);
    expect(getByRole('button', { name: 'match.events' })).toBeDisabled();
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

describe('MatchCard compact without actions', () => {
  it('shows the given title and no buttons', () => {
    const { getByText, queryByRole } = render(
      <MatchCard
        variant="compact"
        match={match({})}
        title="UPL 2025/26"
        actions={false}
        onOpenLink={jest.fn()}
      />,
    );

    expect(getByText('UPL 2025/26')).toBeTruthy();
    expect(queryByRole('button')).toBeNull();
  });
});

describe('MatchCard full', () => {
  it('shows the countdown and opens tickets before kick-off', () => {
    const onOpenLink = jest.fn();
    const { getByText, getByRole } = render(
      <MatchCard
        match={match({ ticketLink: 'https://t' })}
        onOpenLink={onOpenLink}
      />,
    );

    expect(getByText('match.timeLeft')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'match.tickets' }));

    expect(onOpenLink).toHaveBeenCalledWith('https://t');
  });

  it('disables links the match has no URL for', () => {
    const { getByRole } = render(
      <MatchCard match={match({})} onOpenLink={jest.fn()} />,
    );

    expect(getByRole('button', { name: 'match.lineup' })).toBeDisabled();
    expect(getByRole('button', { name: 'match.tickets' })).toBeDisabled();
  });

  it('shows the score and review link after the match', () => {
    const { getByText, getByRole } = render(
      <MatchCard
        match={match({
          status: 'Match Finished',
          goalsHomeTeam: 2,
          goalsAwayTeam: 1,
          overviewLink: 'https://r',
        })}
        onOpenLink={jest.fn()}
      />,
    );

    expect(getByText('match.finished')).toBeTruthy();
    expect(getByText('2 - 1')).toBeTruthy();
    expect(getByRole('button', { name: 'match.review' })).toBeEnabled();
  });

  it('shows the women badge for a women league', () => {
    const { getByText } = render(
      <MatchCard
        match={match({
          league: { id: 1, name: 'Women League', logo: '', round: '' },
        })}
        onOpenLink={jest.fn()}
      />,
    );

    expect(getByText('match.women')).toBeTruthy();
  });

  it('opens the line-up and videos screens when their handlers are set', () => {
    const onOpenLineup = jest.fn();
    const onOpenVideos = jest.fn();
    const m = match({ videoLink: 'https://v' });
    const { getByRole } = render(
      <MatchCard
        match={m}
        onOpenLink={jest.fn()}
        onOpenLineup={onOpenLineup}
        onOpenVideos={onOpenVideos}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'match.lineup' }));
    fireEvent.press(getByRole('button', { name: 'match.video' }));

    expect(onOpenLineup).toHaveBeenCalledWith(m);
    expect(onOpenVideos).toHaveBeenCalledWith(m);
  });
});
