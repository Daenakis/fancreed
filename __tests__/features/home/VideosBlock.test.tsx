import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';

import { fixturesApi } from '@/api';

import type { Fixture } from '@/types/api';

import { VideosBlock } from '@/features/home';

const match = (overrides: Partial<Fixture>): Fixture => ({
  _id: 1,
  _teamId: 3632,
  event_date: '2026-03-01T16:00:00+00:00',
  status: 'Match Finished',
  homeTeam: { id: 3632, name: 'Rukh', logo: 'https://x/h.png' },
  awayTeam: { id: 10, name: 'Vorskla', logo: 'https://x/a.png' },
  goalsHomeTeam: 2,
  goalsAwayTeam: 1,
  league: { id: 333, name: 'UPL', logo: 'https://x/l.png', round: '' },
  round: 'Regular Season - 19',
  ...overrides,
});

const mockFixtures = (fixtures: Fixture[]) =>
  jest.spyOn(fixturesApi, 'actual').mockResolvedValue(apiOk({ fixtures }));

describe('VideosBlock', () => {
  it('opens the video of a played match', async () => {
    mockFixtures([
      match({ videoLink: 'https://youtu.be/7yRWXbMV-kA' }),
      match({ _id: 2, status: 'Not Started', videoLink: 'https://youtu.be/x' }),
    ]);
    const onOpenVideo = jest.fn();
    const { findAllByRole } = render(<VideosBlock onOpenVideo={onOpenVideo} />);

    const cards = await findAllByRole('button', { name: 'home.videoTitle' });
    fireEvent.press(cards[0]);

    expect(cards).toHaveLength(1);
    expect(onOpenVideo).toHaveBeenCalledWith('https://youtu.be/7yRWXbMV-kA');
  });

  it('renders nothing when no played match has a video', async () => {
    mockFixtures([match({ videoLink: null })]);
    const { toJSON } = render(<VideosBlock onOpenVideo={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
