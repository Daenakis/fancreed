import { fireEvent, render, waitFor } from '@tests/test-utils';

import { SignUpForm } from '@/features/auth/components';

const setup = () => {
  const handlers = { onSubmit: jest.fn(), onSignIn: jest.fn() };
  return { ...render(<SignUpForm {...handlers} />), ...handlers };
};

const fillValid = (utils: ReturnType<typeof setup>, name = 'Andriy') => {
  fireEvent.changeText(utils.getByLabelText('auth.namePlaceholder'), name);
  fireEvent.changeText(
    utils.getByLabelText('auth.emailPlaceholder'),
    'user@mail.com',
  );
  fireEvent.changeText(utils.getByLabelText('auth.password'), 'secret1');
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
    const VALID = {
      'auth.namePlaceholder': 'Andriy',
      'auth.emailPlaceholder': 'user@mail.com',
      'auth.password': 'secret1',
    } as const;

    const fillWith = (
      utils: ReturnType<typeof setup>,
      overrides: Partial<Record<keyof typeof VALID, string>>,
    ) => {
      const values = { ...VALID, ...overrides };
      (Object.keys(values) as (keyof typeof VALID)[]).forEach((label) =>
        fireEvent.changeText(utils.getByLabelText(label), values[label]),
      );
    };

    it('shows no error while the user is typing', () => {
      const utils = setup();

      fillWith(utils, { 'auth.emailPlaceholder': 'user@' });

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
    ] as const)(
      'shows an error when %s is "%s" and the button is pressed',
      async (label, text, error) => {
        const utils = setup();
        fillWith(utils, { [label]: text });

        fireEvent.press(utils.getByRole('button', { name: 'auth.signUp' }));

        expect(await utils.findByText(error)).toBeTruthy();
        expect(utils.onSubmit).not.toHaveBeenCalled();
      },
    );
  });
});
