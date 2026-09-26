import { fireEvent, render, waitFor } from '@tests/test-utils';

import { SignInForm } from '@/features/auth/components';

const setup = () => {
  const handlers = {
    onSubmit: jest.fn(),
    onForgotPassword: jest.fn(),
    onCreateAccount: jest.fn(),
  };
  return { ...render(<SignInForm {...handlers} />), ...handlers };
};

const fill = async (
  getByLabelText: (label: string) => Parameters<typeof fireEvent.changeText>[0],
  login: string,
  password: string,
) => {
  fireEvent.changeText(getByLabelText('auth.loginPlaceholder'), login);
  fireEvent.changeText(getByLabelText('auth.password'), password);
};

describe('SignInForm', () => {
  it('disables the submit button when fields are empty', () => {
    const { getByRole } = setup();

    expect(getByRole('button', { name: 'auth.signIn' })).toBeDisabled();
  });

  it('keeps submit disabled when the login is only whitespace', async () => {
    const { getByLabelText, getByRole } = setup();

    await fill(getByLabelText, '   ', 'secret');

    await waitFor(() =>
      expect(getByRole('button', { name: 'auth.signIn' })).toBeDisabled(),
    );
  });

  it('submits trimmed values when both fields are filled', async () => {
    const { getByLabelText, getByRole, onSubmit } = setup();

    await fill(getByLabelText, '  user@mail.com ', 'secret');
    await waitFor(() =>
      expect(getByRole('button', { name: 'auth.signIn' })).toBeEnabled(),
    );
    fireEvent.press(getByRole('button', { name: 'auth.signIn' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { login: 'user@mail.com', password: 'secret' },
        undefined,
      ),
    );
  });

  it('calls the link handlers when forgot password and create account are pressed', () => {
    const { getByRole, onForgotPassword, onCreateAccount } = setup();

    fireEvent.press(getByRole('link', { name: 'auth.forgotPassword' }));
    fireEvent.press(getByRole('link', { name: 'auth.createAccount' }));

    expect(onForgotPassword).toHaveBeenCalledTimes(1);
    expect(onCreateAccount).toHaveBeenCalledTimes(1);
  });
});
