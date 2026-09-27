import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { useLocalSearchParams } from 'expo-router';

import { clubsApi } from '@/api';

import type { ClubEvent } from '@/types/api';

import { ClubEventScreen } from '@/features/clubs';

const event = (overrides: Partial<ClubEvent> = {}): ClubEvent => ({
  _id: 'e1',
  type: 'club',
  kind: 'trip',
  title: 'Trip',
  time: 0,
  location: '',
  startDate: 1805302800,
  description: 'Away game',
  totalMembers: 4,
  locations: [
    { location: 'Stryiska 199', coords: { latitude: 1, longitude: 2 } },
  ],
  ...overrides,
});

beforeEach(() => {
  jest
    .mocked(useLocalSearchParams)
    .mockReturnValue({ id: 'c1', eventId: 'e1' });
});

describe('ClubEventScreen', () => {
  it('shows the kind, members and address', async () => {
    jest.spyOn(clubsApi, 'event').mockResolvedValue(apiOk({ event: event() }));
    const { findByLabelText, getByRole, getAllByRole } = render(
      <ClubEventScreen />,
    );

    expect(await findByLabelText('event.members: 5')).toBeTruthy();
    expect(
      getByRole('link', { name: 'event.address: Stryiska 199' }),
    ).toBeTruthy();
    // Page title and card title.
    expect(getAllByRole('header', { name: 'events.kind.trip' })).toHaveLength(
      2,
    );
  });

  it('accepts the event under the apidoc field name "events"', async () => {
    jest.spyOn(clubsApi, 'event').mockResolvedValue(apiOk({ events: event() }));
    const { findByLabelText } = render(<ClubEventScreen />);

    expect(await findByLabelText('event.members: 5')).toBeTruthy();
  });

  it('joins the event from the footer', async () => {
    jest.spyOn(clubsApi, 'event').mockResolvedValue(apiOk({ event: event() }));
    const join = jest
      .spyOn(clubsApi, 'joinEvent')
      .mockResolvedValue(apiOk(undefined));
    const { findByRole } = render(<ClubEventScreen />);

    fireEvent.press(await findByRole('button', { name: 'event.join' }));

    await waitFor(() => expect(join).toHaveBeenCalledWith('c1', 'e1'));
  });
});
