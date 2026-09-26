import { fireEvent, render, waitFor } from '@tests/test-utils';

import { SignUpForm } from '@/features/auth/components';

const setup = () => {
  const handlers = { onSubmit: jest.fn(), onSignIn: jest.fn() };
  return { ...render(<SignUpForm {...handlers} />), ...handlers };
};

describe('SignUpForm', () => {
  it('disables the submit button when fields are empty', () => {
    const { getByRole } = setup();

    expect(getByRole('button', { name: 'auth.signUp' })).toBeDisabled();
  });

  it('keeps submit disabled when the name is missing', async () => {
    const { getByLabelText, getByRole } = setup();

    fireEvent.changeText(getByLabelText('auth.loginPlaceholder'), 'a@b.c');
    fireEvent.changeText(getByLabelText('auth.password'), 'secret');

    await waitFor(() =>
      expect(getByRole('button', { name: 'auth.signUp' })).toBeDisabled(),
    );
  });

  it('submits trimmed values when all fields are filled', async () => {
    const { getByLabelText, getByRole, onSubmit } = setup();

    fireEvent.changeText(getByLabelText('auth.namePlaceholder'), ' Andriy ');
    fireEvent.changeText(getByLabelText('auth.loginPlaceholder'), 'a@b.c');
    fireEvent.changeText(getByLabelText('auth.password'), 'secret');
    await waitFor(() =>
      expect(getByRole('button', { name: 'auth.signUp' })).toBeEnabled(),
    );
    fireEvent.press(getByRole('button', { name: 'auth.signUp' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { name: 'Andriy', login: 'a@b.c', password: 'secret' },
        undefined,
      ),
    );
  });

  it('calls onSignIn when the sign-in link is pressed', () => {
    const { getByRole, onSignIn } = setup();

    fireEvent.press(getByRole('link', { name: 'auth.signIn' }));

    expect(onSignIn).toHaveBeenCalledTimes(1);
  });
});
