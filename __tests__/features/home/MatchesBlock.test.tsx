import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';

import { fixturesApi } from '@/api';

import type { Fixture } from '@/types/api';

import { MatchesBlock } from '@/features/home';

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

const mockFixtures = (fixtures: Fixture[]) =>
  jest.spyOn(fixturesApi, 'actual').mockResolvedValue(apiOk({ fixtures }));

describe('MatchesBlock', () => {
  it('shows the score and review link of a finished match', async () => {
    mockFixtures([
      match({
        status: 'Match Finished',
        goalsHomeTeam: 2,
        goalsAwayTeam: 1,
        overviewLink: 'https://club/review',
      }),
    ]);
    const onOpenLink = jest.fn();
    const { findByLabelText, getByRole, getByText } = render(
      <MatchesBlock onOpenLink={onOpenLink} />,
    );

    expect(await findByLabelText('match.score')).toBeTruthy();
    expect(getByText('match.status.finished')).toBeTruthy();
    fireEvent.press(getByRole('link', { name: 'match.review' }));
    expect(onOpenLink).toHaveBeenCalledWith('https://club/review');
  });

  it('shows a countdown and the tickets link before kick-off', async () => {
    mockFixtures([match({ ticketLink: 'https://club/tickets' })]);
    const { findByText, getByRole, queryByLabelText } = render(
      <MatchesBlock onOpenLink={jest.fn()} />,
    );

    expect(await findByText('match.status.upcoming')).toBeTruthy();
    expect(getByRole('link', { name: 'match.tickets' })).toBeTruthy();
    expect(queryByLabelText('match.score')).toBeNull();
  });

  it('hides links the match does not have', async () => {
    mockFixtures([
      match({ status: 'Match Finished', goalsHomeTeam: 0, goalsAwayTeam: 0 }),
    ]);
    const { findByLabelText, queryByRole } = render(
      <MatchesBlock onOpenLink={jest.fn()} />,
    );

    await findByLabelText('match.score');
    expect(queryByRole('link')).toBeNull();
  });

  it('renders nothing without fixtures', async () => {
    mockFixtures([]);
    const { toJSON } = render(<MatchesBlock onOpenLink={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });

  it('hides the countdown when kick-off time has already passed', async () => {
    mockFixtures([match({ event_date: '2020-01-01T10:00:00+00:00' })]);
    const { findByText, queryByText } = render(
      <MatchesBlock onOpenLink={jest.fn()} />,
    );

    await findByText('match.status.upcoming');
    expect(queryByText(/match.minutes/)).toBeNull();
  });
});
