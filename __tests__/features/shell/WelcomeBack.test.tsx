import { apiOk, render, waitFor } from '@tests/test-utils';
import { AxiosError } from 'axios';

import { profileApi } from '@/api';

import { useAuthStore } from '@/store';

import type { Profile } from '@/types/api';

import { WelcomeBack } from '@/features/shell';

const profile = (name: string | null): Profile => ({
  email: 'fan@example.com',
  role: 'basic',
  name,
});

beforeEach(() => {
  useAuthStore.setState({ accessToken: 'token' });
});

describe('WelcomeBack', () => {
  it('greets the fan by name once the profile loads', async () => {
    jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile('Ivan')));
    const { findByRole } = render(<WelcomeBack onDone={jest.fn()} />);

    expect(
      await findByRole('header', { name: 'auth.welcomeBack' }),
    ).toBeTruthy();
  });

  it('greets without a name when the profile has none', async () => {
    jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile(null)));
    const { findByRole } = render(<WelcomeBack onDone={jest.fn()} />);

    expect(
      await findByRole('header', { name: 'auth.welcomeBackNoName' }),
    ).toBeTruthy();
  });

  it('leaves when the profile fails to load', async () => {
    jest
      .spyOn(profileApi, 'get')
      .mockRejectedValue(new AxiosError('Request failed'));
    const onDone = jest.fn();
    render(<WelcomeBack onDone={onDone} />);

    await waitFor(() => expect(onDone).toHaveBeenCalled());
  });
});
