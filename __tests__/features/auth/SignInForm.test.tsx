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

const fill = (
  utils: ReturnType<typeof setup>,
  email: string,
  password: string,
) => {
  fireEvent.changeText(utils.getByLabelText('auth.emailPlaceholder'), email);
  fireEvent.changeText(utils.getByLabelText('auth.password'), password);
};

describe('SignInForm', () => {
  it('disables the submit button when fields are empty', () => {
    const { getByRole } = setup();

    expect(getByRole('button', { name: 'auth.signIn' })).toBeDisabled();
  });

  it('keeps submit disabled when the password is shorter than 6', async () => {
    const utils = setup();

    fill(utils, 'user@mail.com', '12345');

    await waitFor(() =>
      expect(utils.getByRole('button', { name: 'auth.signIn' })).toBeDisabled(),
    );
  });

  it('submits trimmed values when both fields are valid', async () => {
    const utils = setup();

    fill(utils, '  user@mail.com ', 'secret1');
    await waitFor(() =>
      expect(utils.getByRole('button', { name: 'auth.signIn' })).toBeEnabled(),
    );
    fireEvent.press(utils.getByRole('button', { name: 'auth.signIn' }));

    await waitFor(() =>
      expect(utils.onSubmit).toHaveBeenCalledWith(
        { login: 'user@mail.com', password: 'secret1' },
        expect.any(Function),
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
