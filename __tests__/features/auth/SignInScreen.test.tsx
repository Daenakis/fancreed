import { apiFail, apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { useRouter } from 'expo-router';

import { authApi } from '@/api';

import { useAuthStore, usePendingActivationStore } from '@/store';

import type { LoginResponse } from '@/types/api';

import { SignInScreen } from '@/features/auth';

// The expo-router mock returns one shared router object, not a real hook.
// eslint-disable-next-line react-hooks/rules-of-hooks
const router = useRouter();

const loginResponse = (activated: boolean): LoginResponse => ({
  userId: 'u1',
  activated,
  userRole: 'basic',
  access_token: 'token-1',
  token_type: 'Bearer',
});

const submit = async (utils: ReturnType<typeof render>) => {
  fireEvent.changeText(
    utils.getByLabelText('auth.emailPlaceholder'),
    'user@mail.com',
  );
  fireEvent.changeText(utils.getByLabelText('auth.password'), 'secret1');
  await waitFor(() =>
    expect(utils.getByRole('button', { name: 'auth.signIn' })).toBeEnabled(),
  );
  fireEvent.press(utils.getByRole('button', { name: 'auth.signIn' }));
};

beforeEach(() => {
  useAuthStore.setState({ accessToken: null });
  usePendingActivationStore.getState().clear();
});

describe('SignInScreen', () => {
  it('renders the title and a disabled sign-in button when opened', () => {
    const { getByRole } = render(<SignInScreen />);

    expect(getByRole('header', { name: 'auth.signInTitle' })).toBeTruthy();
    expect(getByRole('button', { name: 'auth.signIn' })).toBeDisabled();
  });

  it('signs in when the account is activated', async () => {
    const login = jest
      .spyOn(authApi, 'login')
      .mockResolvedValue(apiOk(loginResponse(true)));
    const utils = render(<SignInScreen />);

    await submit(utils);

    await waitFor(() =>
      expect(useAuthStore.getState().accessToken).toBe('token-1'),
    );
    expect(login).toHaveBeenCalledWith({
      login: 'user@mail.com',
      password: 'secret1',
    });
  });

  it('opens activation instead of signing in when the email is not confirmed', async () => {
    jest.spyOn(authApi, 'login').mockResolvedValue(apiOk(loginResponse(false)));
    const utils = render(<SignInScreen />);

    await submit(utils);

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/activate',
        params: { resend: '1' },
      }),
    );
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(usePendingActivationStore.getState().email).toBe('user@mail.com');
  });

  it('shows the error on the password field when the password is wrong', async () => {
    jest
      .spyOn(authApi, 'login')
      .mockRejectedValue(apiFail(403, 'Wrong password'));
    const utils = render(<SignInScreen />);

    await submit(utils);

    expect(await utils.findByText('errors.api.wrongPassword')).toBeTruthy();
  });
});
