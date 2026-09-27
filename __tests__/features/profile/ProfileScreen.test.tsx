import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import * as ImagePicker from 'expo-image-picker';
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

  it('uploads the picked photo as JPEG base64', async () => {
    jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile));
    const setPhoto = jest
      .spyOn(profileApi, 'setPhoto')
      .mockResolvedValue(apiOk(profile));
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://a.jpg', width: 1, height: 1, base64: 'QUJD' }],
    });
    const { findByRole } = render(<ProfileScreen />);

    fireEvent.press(
      await findByRole('button', { name: 'profile.changePhoto' }),
    );

    await waitFor(() =>
      expect(setPhoto).toHaveBeenCalledWith({
        mimeType: 'image/jpeg',
        data: 'QUJD',
      }),
    );
  });

  it('uploads nothing when picking is cancelled', async () => {
    jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile));
    const setPhoto = jest.spyOn(profileApi, 'setPhoto');
    jest
      .mocked(ImagePicker.launchImageLibraryAsync)
      .mockResolvedValue({ canceled: true, assets: null });
    const { findByRole } = render(<ProfileScreen />);

    fireEvent.press(
      await findByRole('button', { name: 'profile.changePhoto' }),
    );

    await waitFor(() =>
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled(),
    );
    expect(setPhoto).not.toHaveBeenCalled();
  });
});
