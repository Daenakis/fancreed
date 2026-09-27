import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
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
});
