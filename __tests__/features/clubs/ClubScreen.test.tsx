import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { router, useLocalSearchParams } from 'expo-router';

import { clubsApi } from '@/api';

import type { Club } from '@/types/api';

import { ClubScreen } from '@/features/clubs';

const club = (overrides: Partial<Club> = {}): Club => ({
  _id: 'c1',
  name: 'Ultras',
  description: 'We support the team',
  address: 'Stryiska 199, Lviv',
  totalMembers: 14,
  owner: { name: 'Dmytro' },
  telegram: 'https://t.me/ultras',
  ...overrides,
});

const mockClub = (value: Club) => {
  jest.spyOn(clubsApi, 'one').mockResolvedValue(apiOk({ club: value }));
  jest.spyOn(clubsApi, 'events').mockResolvedValue(apiOk({ events: [] }));
};

beforeEach(() => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: 'c1' });
});

describe('ClubScreen', () => {
  it('shows the club details with the owner counted as a member', async () => {
    mockClub(club());
    const { findByLabelText, getByLabelText, getByRole } = render(
      <ClubScreen />,
    );

    expect(await findByLabelText('club.members: 15')).toBeTruthy();
    expect(getByLabelText('club.founder: Dmytro')).toBeTruthy();
    expect(getByRole('link', { name: 'Telegram' })).toBeTruthy();
  });

  it('joins the club from the footer', async () => {
    mockClub(club());
    const join = jest
      .spyOn(clubsApi, 'join')
      .mockResolvedValue(apiOk(undefined));
    const { findByRole } = render(<ClubScreen />);

    fireEvent.press(await findByRole('button', { name: 'club.join' }));

    await waitFor(() => expect(join).toHaveBeenCalledWith('c1'));
  });

  it('lets a member leave', async () => {
    mockClub(club({ youMember: true }));
    const leave = jest
      .spyOn(clubsApi, 'leave')
      .mockResolvedValue(apiOk(undefined));
    const { findByRole } = render(<ClubScreen />);

    fireEvent.press(await findByRole('button', { name: 'club.leave' }));

    await waitFor(() => expect(leave).toHaveBeenCalledWith('c1'));
  });

  it('lets the owner create an event', async () => {
    mockClub(club({ youOwner: true }));
    const { findByRole } = render(<ClubScreen />);

    fireEvent.press(await findByRole('button', { name: 'club.createEvent' }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/gamification/clubs/[id]/events/create',
      params: { id: 'c1' },
    });
  });
});
