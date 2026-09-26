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

  it('unlocks the button once both fields have text, even if invalid', async () => {
    const utils = setup();

    fill(utils, 'user@mail.com', '123');

    await waitFor(() =>
      expect(utils.getByRole('button', { name: 'auth.signIn' })).toBeEnabled(),
    );
  });

  it('shows the error only after the button is pressed', async () => {
    const utils = setup();

    fill(utils, 'user@mail.com', '123');
    expect(utils.queryByText('auth.errors.passwordTooShort')).toBeNull();

    fireEvent.press(utils.getByRole('button', { name: 'auth.signIn' }));

    expect(await utils.findByText('auth.errors.passwordTooShort')).toBeTruthy();
    expect(utils.onSubmit).not.toHaveBeenCalled();
  });

  it('removes the error when the user edits the field', async () => {
    const utils = setup();
    fill(utils, 'user@mail.com', '123');
    fireEvent.press(utils.getByRole('button', { name: 'auth.signIn' }));
    await utils.findByText('auth.errors.passwordTooShort');

    fireEvent.changeText(utils.getByLabelText('auth.password'), '1234');

    expect(utils.queryByText('auth.errors.passwordTooShort')).toBeNull();
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
