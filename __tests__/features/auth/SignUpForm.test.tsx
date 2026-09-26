import { fireEvent, render, waitFor } from '@tests/test-utils';

import { SignUpForm } from '@/features/auth/components';

const setup = () => {
  const handlers = { onSubmit: jest.fn(), onSignIn: jest.fn() };
  return { ...render(<SignUpForm {...handlers} />), ...handlers };
};

const typeAndLeave = (
  utils: ReturnType<typeof setup>,
  label: string,
  text: string,
) => {
  const input = utils.getByLabelText(label);
  fireEvent.changeText(input, text);
  fireEvent(input, 'blur');
};

const fillValid = (utils: ReturnType<typeof setup>, name = 'Andriy') => {
  typeAndLeave(utils, 'auth.namePlaceholder', name);
  typeAndLeave(utils, 'auth.emailPlaceholder', 'user@mail.com');
  typeAndLeave(utils, 'auth.password', 'secret1');
};

describe('SignUpForm', () => {
  it('disables the submit button when fields are empty', () => {
    const { getByRole } = setup();

    expect(getByRole('button', { name: 'auth.signUp' })).toBeDisabled();
  });

  it('submits normalised values when all fields are valid', async () => {
    const utils = setup();

    fillValid(utils, ' Андрій Ів’ян ');
    await waitFor(() =>
      expect(utils.getByRole('button', { name: 'auth.signUp' })).toBeEnabled(),
    );
    fireEvent.press(utils.getByRole('button', { name: 'auth.signUp' }));

    await waitFor(() =>
      expect(utils.onSubmit).toHaveBeenCalledWith(
        { name: "Андрій Ів'ян", email: 'user@mail.com', password: 'secret1' },
        expect.any(Function),
      ),
    );
  });

  it('calls onSignIn when the sign-in link is pressed', () => {
    const { getByRole, onSignIn } = setup();

    fireEvent.press(getByRole('link', { name: 'auth.signIn' }));

    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  describe('validation (backend rules)', () => {
    it('shows no error while the user is still typing', () => {
      const utils = setup();

      fireEvent.changeText(utils.getByLabelText('auth.emailPlaceholder'), 'x');

      expect(utils.queryByText(/auth.errors/)).toBeNull();
    });

    it.each([
      ['auth.emailPlaceholder', 'user@', 'auth.errors.emailInvalid'],
      [
        'auth.emailPlaceholder',
        'user+tag@mail.com',
        'auth.errors.emailInvalid',
      ],
      ['auth.namePlaceholder', 'A', 'auth.errors.nameTooShort'],
      ['auth.namePlaceholder', 'Andriy!', 'auth.errors.nameInvalid'],
      ['auth.password', 'abc12', 'auth.errors.passwordTooShort'],
      ['auth.password', 'a'.repeat(33), 'auth.errors.passwordTooLong'],
      ['auth.password', 'pass word1', 'auth.errors.passwordInvalid'],
      ['auth.password', 'пароль123', 'auth.errors.passwordInvalid'],
    ])(
      'shows an error when %s is "%s" and the field is left',
      async (label, text, error) => {
        const utils = setup();

        typeAndLeave(utils, label, text);

        expect(await utils.findByText(error)).toBeTruthy();
      },
    );
  });
});
