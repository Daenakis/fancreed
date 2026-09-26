import { apiFail, apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { useRouter } from 'expo-router';

import { authApi } from '@/api';

import { useAuthStore } from '@/store';

import {
  ForgotPasswordScreen,
  NewPasswordScreen,
  VerifyCodeScreen,
} from '@/features/auth';

// The expo-router mock returns one shared router object, not a real hook.
// eslint-disable-next-line react-hooks/rules-of-hooks
const router = useRouter();

describe.each([
  ['ForgotPasswordScreen', ForgotPasswordScreen],
  ['VerifyCodeScreen', VerifyCodeScreen],
  ['NewPasswordScreen', NewPasswordScreen],
])('%s footer', (_name, Screen) => {
  it('returns to sign-in when the sign-in link is pressed', () => {
    const { getByRole } = render(<Screen />);

    fireEvent.press(getByRole('link', { name: 'auth.signIn' }));

    expect(router.dismissTo).toHaveBeenCalledWith('/sign-in');
  });
});

describe('ForgotPasswordScreen', () => {
  const submit = async (utils: ReturnType<typeof render>) => {
    fireEvent.changeText(
      utils.getByLabelText('auth.emailPlaceholder'),
      'user@mail.com',
    );
    await waitFor(() =>
      expect(
        utils.getByRole('button', { name: 'auth.resetPassword' }),
      ).toBeEnabled(),
    );
    fireEvent.press(utils.getByRole('button', { name: 'auth.resetPassword' }));
  };

  it('sends the recovery email and opens the code screen', async () => {
    const forgot = jest
      .spyOn(authApi, 'forgotPassword')
      .mockResolvedValue(apiOk(undefined));
    const utils = render(<ForgotPasswordScreen />);

    await submit(utils);

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/verify-code',
        params: { email: 'user@mail.com' },
      }),
    );
    expect(forgot).toHaveBeenCalledWith({ email: 'user@mail.com' });
  });

  it('shows the error on the email field when no account exists', async () => {
    jest
      .spyOn(authApi, 'forgotPassword')
      .mockRejectedValue(apiFail(404, 'Document not found'));
    const utils = render(<ForgotPasswordScreen />);

    await submit(utils);

    expect(await utils.findByText('errors.api.accountNotFound')).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });
});

describe('VerifyCodeScreen', () => {
  it('opens the new-password screen with the code once 8 characters are typed', () => {
    const utils = render(<VerifyCodeScreen />);

    fireEvent.changeText(utils.getByLabelText('auth.codeTitle'), 'aB3-xY9_z');

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/new-password',
      params: { email: '', code: 'aB3xY9_z' },
    });
  });

  it('waits while the code is incomplete', () => {
    const utils = render(<VerifyCodeScreen />);

    fireEvent.changeText(utils.getByLabelText('auth.codeTitle'), '1234567');

    expect(router.push).not.toHaveBeenCalled();
  });
});

describe('NewPasswordScreen', () => {
  const submit = async (utils: ReturnType<typeof render>) => {
    fireEvent.changeText(utils.getByLabelText('auth.newPassword'), 'secret1');
    fireEvent.changeText(
      utils.getByLabelText('auth.repeatPassword'),
      'secret1',
    );
    await waitFor(() =>
      expect(utils.getByRole('button', { name: 'auth.save' })).toBeEnabled(),
    );
    fireEvent.press(utils.getByRole('button', { name: 'auth.save' }));
  };

  beforeEach(() => useAuthStore.setState({ accessToken: null }));

  it('shows a mismatch error when passwords differ and save is pressed', async () => {
    const recover = jest.spyOn(authApi, 'recoverPassword');
    const { getByLabelText, getByRole, findByText } = render(
      <NewPasswordScreen />,
    );

    fireEvent.changeText(getByLabelText('auth.newPassword'), 'secret1');
    fireEvent.changeText(getByLabelText('auth.repeatPassword'), 'secret2');
    fireEvent.press(getByRole('button', { name: 'auth.save' }));

    expect(await findByText('auth.errors.passwordsMismatch')).toBeTruthy();
    expect(recover).not.toHaveBeenCalled();
  });

  it('sets the new password and signs in with it', async () => {
    const recover = jest
      .spyOn(authApi, 'recoverPassword')
      .mockResolvedValue(apiOk(undefined));
    jest.spyOn(authApi, 'login').mockResolvedValue(
      apiOk({
        userId: 'u1',
        activated: true,
        userRole: 'basic',
        access_token: 'token-1',
        token_type: 'Bearer',
      }),
    );
    const utils = render(<NewPasswordScreen />);

    await submit(utils);

    await waitFor(() =>
      expect(useAuthStore.getState().accessToken).toBe('token-1'),
    );
    expect(recover).toHaveBeenCalledWith({
      email: '',
      code: '',
      password: 'secret1',
    });
  });

  it('explains the code was rejected when the backend says wrong code', async () => {
    jest
      .spyOn(authApi, 'recoverPassword')
      .mockRejectedValue(apiFail(403, 'Wrong code'));
    const utils = render(<NewPasswordScreen />);

    await submit(utils);

    expect(await utils.findByText('auth.errors.codeRejected')).toBeTruthy();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
