import { apiFail, apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { useRouter } from 'expo-router';

import { authApi } from '@/api';

import { usePendingActivationStore } from '@/store';

import { SignUpScreen } from '@/features/auth';

// eslint-disable-next-line react-hooks/rules-of-hooks
const router = useRouter();

const submit = async (utils: ReturnType<typeof render>) => {
  fireEvent.changeText(utils.getByLabelText('auth.namePlaceholder'), 'Andriy');
  fireEvent.changeText(
    utils.getByLabelText('auth.emailPlaceholder'),
    'user@mail.com',
  );
  fireEvent.changeText(utils.getByLabelText('auth.password'), 'secret1');
  await waitFor(() =>
    expect(utils.getByRole('button', { name: 'auth.signUp' })).toBeEnabled(),
  );
  fireEvent.press(utils.getByRole('button', { name: 'auth.signUp' }));
};

beforeEach(() => usePendingActivationStore.getState().clear());

describe('SignUpScreen', () => {
  it('renders the title and a disabled sign-up button when opened', () => {
    const { getByRole } = render(<SignUpScreen />);

    expect(getByRole('header', { name: 'auth.signUpTitle' })).toBeTruthy();
    expect(getByRole('button', { name: 'auth.signUp' })).toBeDisabled();
  });

  it('registers and opens activation when the form is submitted', async () => {
    const register = jest
      .spyOn(authApi, 'register')
      .mockResolvedValue(apiOk(undefined));
    const utils = render(<SignUpScreen />);

    await submit(utils);

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/activate'));
    expect(register).toHaveBeenCalledWith({
      name: 'Andriy',
      email: 'user@mail.com',
      password: 'secret1',
    });
    expect(usePendingActivationStore.getState().email).toBe('user@mail.com');
  });

  it('shows the error on the email field when the user already exists', async () => {
    jest
      .spyOn(authApi, 'register')
      .mockRejectedValue(apiFail(409, 'User already exists'));
    const utils = render(<SignUpScreen />);

    await submit(utils);

    expect(await utils.findByText('errors.api.userExists')).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });
});
