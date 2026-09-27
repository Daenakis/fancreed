import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';

import { clubsApi, eventsApi } from '@/api';

import type { Club, ClubEvent } from '@/types/api';

import { ClubEventsBlock, FanClubsBlock } from '@/features/gamification';

const club: Club = { _id: 'c1', name: 'Knights', origPhoto: 'https://x/c.png' };
const clubEvent: ClubEvent = {
  _id: 'e1',
  type: 'club',
  time: '2026-10-01T15:00:00Z',
  title: 'Away trip',
  location: 'Kyiv',
  kind: 'trip',
};

describe('FanClubsBlock', () => {
  it('opens the pressed club', async () => {
    jest.spyOn(clubsApi, 'list').mockResolvedValue(apiOk({ clubs: [club] }));
    const onOpenClub = jest.fn();
    const { findByRole } = render(<FanClubsBlock onOpenClub={onOpenClub} />);

    fireEvent.press(await findByRole('button', { name: 'Knights' }));

    expect(onOpenClub).toHaveBeenCalledWith(club);
  });

  it('offers to create a club even when there are none', async () => {
    jest.spyOn(clubsApi, 'list').mockResolvedValue(apiOk({ clubs: [] }));
    const onCreateClub = jest.fn();
    const { findByRole } = render(
      <FanClubsBlock onOpenClub={jest.fn()} onCreateClub={onCreateClub} />,
    );

    fireEvent.press(await findByRole('button', { name: 'club.createClub' }));

    expect(onCreateClub).toHaveBeenCalledTimes(1);
  });

  it('renders nothing without clubs or a create action', async () => {
    jest.spyOn(clubsApi, 'list').mockResolvedValue(apiOk({ clubs: [] }));
    const { toJSON } = render(<FanClubsBlock onOpenClub={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});

describe('ClubEventsBlock', () => {
  it('opens the pressed event', async () => {
    jest
      .spyOn(eventsApi, 'clubList')
      .mockResolvedValue(apiOk({ events: [clubEvent] }));
    const onOpenEvent = jest.fn();
    const { findByRole } = render(
      <ClubEventsBlock onOpenEvent={onOpenEvent} />,
    );

    // Rows are named by the event kind.
    fireEvent.press(await findByRole('button', { name: 'events.kind.trip' }));

    expect(onOpenEvent).toHaveBeenCalledWith(clubEvent);
  });

  it('shows "+" only when the fan can create events', async () => {
    jest
      .spyOn(eventsApi, 'clubList')
      .mockResolvedValue(apiOk({ events: [clubEvent] }));
    const onCreateEvent = jest.fn();
    const { findByRole } = render(
      <ClubEventsBlock onOpenEvent={jest.fn()} onCreateEvent={onCreateEvent} />,
    );

    fireEvent.press(await findByRole('button', { name: 'club.createEvent' }));

    expect(onCreateEvent).toHaveBeenCalledTimes(1);
  });
});
