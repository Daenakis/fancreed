import { fireEvent, render, waitFor } from '@tests/test-utils';
import { useRouter } from 'expo-router';
import { AccessibilityInfo } from 'react-native';

import { MockApiError, mockAuthApi } from '@/api';

import {
  ForgotPasswordScreen,
  NewPasswordScreen,
  VerifyCodeScreen,
} from '@/features/auth';

// The expo-router mock returns one shared router object, not a real hook.
// eslint-disable-next-line react-hooks/rules-of-hooks
const router = useRouter();

describe('ForgotPasswordScreen', () => {
  it('disables reset until the login is filled', () => {
    const { getByRole } = render(<ForgotPasswordScreen />);

    expect(getByRole('button', { name: 'auth.resetPassword' })).toBeDisabled();
  });

  it('requests a reset and opens the code screen when submitted', async () => {
    const request = jest
      .spyOn(mockAuthApi, 'requestPasswordReset')
      .mockResolvedValue(undefined);
    const { getByLabelText, getByRole } = render(<ForgotPasswordScreen />);

    fireEvent.changeText(getByLabelText('auth.loginPlaceholder'), 'a@b.c');
    await waitFor(() =>
      expect(getByRole('button', { name: 'auth.resetPassword' })).toBeEnabled(),
    );
    fireEvent.press(getByRole('button', { name: 'auth.resetPassword' }));

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/verify-code',
        params: { login: 'a@b.c' },
      }),
    );
    expect(request).toHaveBeenCalledWith({ login: 'a@b.c' });
  });
});

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

describe('VerifyCodeScreen', () => {
  const typeCode = (utils: ReturnType<typeof render>, code: string) =>
    fireEvent.changeText(utils.getByLabelText('auth.codeTitle'), code);

  it('has no submit button and waits for all digits before checking', () => {
    const verify = jest.spyOn(mockAuthApi, 'verifyResetCode');
    const utils = render(<VerifyCodeScreen />);

    typeCode(utils, '12345');

    expect(utils.queryByRole('button')).toBeNull();
    expect(verify).not.toHaveBeenCalled();
  });

  it('clears the code and announces the error when a wrong code is entered', async () => {
    jest
      .spyOn(mockAuthApi, 'verifyResetCode')
      .mockRejectedValue(new MockApiError('INVALID_CODE'));
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const utils = render(<VerifyCodeScreen />);

    typeCode(utils, '111111');

    await waitFor(() =>
      expect(announce).toHaveBeenCalledWith('auth.errors.invalidCode'),
    );
    expect(utils.getByLabelText('auth.codeTitle').props.value).toBe('');
    expect(utils.queryByText('auth.errors.invalidCode')).toBeNull();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('opens the new-password screen when a correct code is entered', async () => {
    const verify = jest
      .spyOn(mockAuthApi, 'verifyResetCode')
      .mockResolvedValue({ resetToken: 'tok' });
    const utils = render(<VerifyCodeScreen />);

    typeCode(utils, '123456');

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/new-password',
        params: { resetToken: 'tok' },
      }),
    );
    expect(verify).toHaveBeenCalledWith({ login: '', code: '123456' });
  });
});

describe('NewPasswordScreen', () => {
  it('shows a mismatch error and keeps save disabled when passwords differ', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <NewPasswordScreen />,
    );

    fireEvent.changeText(getByLabelText('auth.newPassword'), 'one');
    fireEvent.changeText(getByLabelText('auth.repeatPassword'), 'two');

    expect(await findByText('auth.errors.passwordsMismatch')).toBeTruthy();
    expect(getByRole('button', { name: 'auth.save' })).toBeDisabled();
  });

  it('saves and returns to sign-in when passwords match', async () => {
    const reset = jest
      .spyOn(mockAuthApi, 'resetPassword')
      .mockResolvedValue(undefined);
    const { getByLabelText, getByRole } = render(<NewPasswordScreen />);

    fireEvent.changeText(getByLabelText('auth.newPassword'), 'secret');
    fireEvent.changeText(getByLabelText('auth.repeatPassword'), 'secret');
    await waitFor(() =>
      expect(getByRole('button', { name: 'auth.save' })).toBeEnabled(),
    );
    fireEvent.press(getByRole('button', { name: 'auth.save' }));

    await waitFor(() =>
      expect(router.dismissTo).toHaveBeenCalledWith('/sign-in'),
    );
    expect(reset).toHaveBeenCalledWith({ resetToken: '', password: 'secret' });
  });
});
