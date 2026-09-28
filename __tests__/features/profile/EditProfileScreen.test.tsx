import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import { profileApi } from '@/api';

import type { Profile } from '@/types/api';

import { EditProfileScreen } from '@/features/profile';

const profile: Profile = {
  _id: 'u1',
  email: 'fan@example.com',
  role: 'user',
  name: 'Andriy',
  surname: 'Melnyk',
  sex: 'm',
  birthDay: 816048000, // 11 Nov 1995 UTC
};

beforeEach(() => {
  jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile));
});

describe('EditProfileScreen', () => {
  it('saves the fields with the birthday in unix seconds and goes back', async () => {
    const edit = jest
      .spyOn(profileApi, 'edit')
      .mockResolvedValue(apiOk(profile));
    const { findByDisplayValue, getByRole } = render(<EditProfileScreen />);

    fireEvent.changeText(await findByDisplayValue('Andriy'), 'Andrii');
    fireEvent.press(getByRole('button', { name: 'common.save' }));

    await waitFor(() =>
      expect(edit).toHaveBeenCalledWith({
        name: 'Andrii',
        surname: 'Melnyk',
        patronymic: undefined,
        sex: 'm',
        birthDay: 816048000,
      }),
    );
    await waitFor(() => expect(router.back).toHaveBeenCalled());
  });

  it('keeps Save disabled until all required fields are filled', async () => {
    jest
      .spyOn(profileApi, 'get')
      .mockResolvedValue(apiOk({ ...profile, birthDay: null, sex: null }));
    const { findByRole } = render(<EditProfileScreen />);

    expect(await findByRole('button', { name: 'common.save' })).toBeDisabled();
  });

  it('uploads the picked photo as JPEG base64', async () => {
    const setPhoto = jest
      .spyOn(profileApi, 'setPhoto')
      .mockResolvedValue(apiOk(profile));
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://a.jpg', width: 1, height: 1, base64: 'QUJD' }],
    });
    const { findByRole } = render(<EditProfileScreen />);

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
    const setPhoto = jest.spyOn(profileApi, 'setPhoto');
    jest
      .mocked(ImagePicker.launchImageLibraryAsync)
      .mockResolvedValue({ canceled: true, assets: null });
    const { findByRole } = render(<EditProfileScreen />);

    fireEvent.press(
      await findByRole('button', { name: 'profile.changePhoto' }),
    );

    await waitFor(() =>
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled(),
    );
    expect(setPhoto).not.toHaveBeenCalled();
  });
});
