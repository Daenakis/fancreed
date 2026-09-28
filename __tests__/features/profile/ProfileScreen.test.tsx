import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { router } from 'expo-router';

import { profileApi, squadsApi } from '@/api';

import type { Profile } from '@/types/api';

import { ProfileScreen } from '@/features/profile';

const profile: Profile = {
  _id: 'u1',
  email: 'fan@example.com',
  role: 'user',
  name: 'Andriy',
  surname: 'Melnyk',
};

beforeEach(() => {
  jest
    .spyOn(squadsApi, 'actual')
    .mockResolvedValue(apiOk({ squad: { _id: 's', _teamId: 1, players: [] } }));
});

describe('ProfileScreen', () => {
  it('asks to fill the profile while required fields are missing', async () => {
    jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile));
    const { findByText } = render(<ProfileScreen />);

    expect(await findByText('profile.fillNotice')).toBeTruthy();
  });

  it('hides the notice and shows the level once the profile is complete', async () => {
    jest
      .spyOn(profileApi, 'get')
      .mockResolvedValue(apiOk({ ...profile, sex: 'm', birthDay: 816048000 }));
    const { findByText, queryByText } = render(<ProfileScreen />);

    expect(await findByText('fanCard.level')).toBeTruthy();
    expect(queryByText('profile.fillNotice')).toBeNull();
  });

  it('opens the edit screen', async () => {
    jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile));
    const { findByRole } = render(<ProfileScreen />);

    fireEvent.press(await findByRole('button', { name: 'profile.edit' }));

    expect(router.push).toHaveBeenCalledWith('/profile/edit');
  });

  it('shows the photo without a change action (it moved to the edit screen)', async () => {
    jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile));
    const { findByText, queryByRole } = render(<ProfileScreen />);

    expect(await findByText('Andriy Melnyk')).toBeTruthy();
    expect(queryByRole('button', { name: 'profile.changePhoto' })).toBeNull();
  });
});
