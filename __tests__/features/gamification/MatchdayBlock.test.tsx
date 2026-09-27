import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import * as Calendar from 'expo-calendar/legacy';
import { Alert } from 'react-native';

import { eventsApi } from '@/api';

import type { AppEvent } from '@/types/api';

import { MatchdayBlock } from '@/features/gamification';

const event = (title: string, time = '2030-10-01T15:00:00Z'): AppEvent => ({
  _id: title,
  type: 'matchday',
  time,
  title,
  location: 'Arena Lviv',
  coords: { latitude: 49.77, longitude: 24.03 },
});

const mockEvents = (events: AppEvent[]) =>
  jest.spyOn(eventsApi, 'matchdayList').mockResolvedValue(apiOk({ events }));

describe('MatchdayBlock', () => {
  it('opens the location of an event', async () => {
    mockEvents([event('Fan zone')]);
    const onOpenLink = jest.fn();
    const { findByRole } = render(<MatchdayBlock onOpenLink={onOpenLink} />);

    fireEvent.press(await findByRole('button', { name: 'event.location' }));

    expect(onOpenLink).toHaveBeenCalledWith(
      'https://www.google.com/maps/search/?api=1&query=49.77%2C24.03',
    );
  });

  it('shows two events and the rest after "show more"', async () => {
    mockEvents([event('A'), event('B'), event('C')]);
    const { findByText, queryByText, getByRole } = render(
      <MatchdayBlock onOpenLink={jest.fn()} />,
    );

    expect(await findByText('B')).toBeTruthy();
    expect(queryByText('C')).toBeNull();
    fireEvent.press(getByRole('button', { name: 'event.showMore' }));
    expect(queryByText('C')).toBeTruthy();
  });

  it('adds a calendar reminder with the chosen offset', async () => {
    mockEvents([event('Fan zone')]);
    jest
      .mocked(Calendar.requestCalendarPermissionsAsync)
      .mockResolvedValue({ granted: true } as never);
    jest
      .mocked(Calendar.getDefaultCalendarAsync)
      .mockResolvedValue({ id: 'cal' } as never);
    jest.mocked(Calendar.createEventAsync).mockResolvedValue('ev');
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { findByRole, getByRole, getByText } = render(
      <MatchdayBlock onOpenLink={jest.fn()} />,
    );

    fireEvent.press(await findByRole('button', { name: 'event.remind' }));
    fireEvent.press(getByRole('radio', { name: 'reminder.hour1' }));
    fireEvent.press(getByText('reminder.confirmOn'));

    await waitFor(() => expect(alert).toHaveBeenCalledWith('reminder.added'));
    expect(Calendar.createEventAsync).toHaveBeenCalledWith(
      'cal',
      expect.objectContaining({ alarms: [{ relativeOffset: -60 }] }),
    );
  });

  it('toggles join and leave', async () => {
    mockEvents([event('Fan zone')]);
    const { findByRole, getByRole } = render(
      <MatchdayBlock onOpenLink={jest.fn()} />,
    );

    fireEvent.press(await findByRole('button', { name: 'event.join' }));

    expect(getByRole('button', { name: 'event.leave' })).toBeTruthy();
  });

  it('renders nothing without events', async () => {
    mockEvents([]);
    const { toJSON } = render(<MatchdayBlock onOpenLink={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
