import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { Share } from 'react-native';

import { eventsApi } from '@/api';

import type { AppEvent } from '@/types/api';

import { MatchdayBlock } from '@/features/gamification';

const event = (title: string): AppEvent => ({
  _id: title,
  type: 'matchday',
  time: '2026-10-01T15:00:00Z',
  title,
  location: 'Arena Lviv',
  coords: { latitude: 49.77, longitude: 24.03 },
});

const mockEvents = (events: AppEvent[]) =>
  jest.spyOn(eventsApi, 'matchdayList').mockResolvedValue(apiOk({ events }));

describe('MatchdayBlock', () => {
  it('shows the latest event with share and location', async () => {
    mockEvents([event('Old party'), event('Fan zone')]);
    const onOpenLink = jest.fn();
    const share = jest
      .spyOn(Share, 'share')
      .mockResolvedValue({ action: 'sharedAction' });
    const { findByText, getByRole, queryByRole } = render(
      <MatchdayBlock onOpenLink={onOpenLink} />,
    );

    expect(await findByText('Fan zone')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'event.location' }));
    expect(onOpenLink).toHaveBeenCalledWith(
      'https://www.google.com/maps/search/?api=1&query=49.77%2C24.03',
    );
    fireEvent.press(getByRole('button', { name: 'event.share' }));
    expect(share).toHaveBeenCalled();
    expect(queryByRole('button', { name: 'event.remind' })).toBeNull();
  });

  it('shows Remind only when the screen supports it', async () => {
    mockEvents([event('Fan zone')]);
    const onRemind = jest.fn();
    const { findByRole } = render(
      <MatchdayBlock onOpenLink={jest.fn()} onRemind={onRemind} />,
    );

    fireEvent.press(await findByRole('button', { name: 'event.remind' }));

    expect(onRemind).toHaveBeenCalledWith(event('Fan zone'));
  });

  it('renders nothing without events', async () => {
    mockEvents([]);
    const { toJSON } = render(<MatchdayBlock onOpenLink={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
