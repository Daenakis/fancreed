import { fireEvent, render, waitFor } from '@tests/test-utils';

import { useAuthStore } from '@/store';

import { SignUpScreen } from '@/features/auth';

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, refreshToken: null });
});

describe('SignUpScreen', () => {
  it('renders the title and a disabled sign-up button when opened', () => {
    const { getByRole } = render(<SignUpScreen />);

    expect(getByRole('header', { name: 'auth.signUpTitle' })).toBeTruthy();
    expect(getByRole('button', { name: 'auth.signUp' })).toBeDisabled();
  });

  it('stores tokens when the filled form is submitted', async () => {
    const { getByLabelText, getByRole } = render(<SignUpScreen />);

    fireEvent.changeText(getByLabelText('auth.namePlaceholder'), 'Andriy');
    fireEvent.changeText(getByLabelText('auth.loginPlaceholder'), 'a@b.c');
    fireEvent.changeText(getByLabelText('auth.password'), 'secret');
    await waitFor(() =>
      expect(getByRole('button', { name: 'auth.signUp' })).toBeEnabled(),
    );
    fireEvent.press(getByRole('button', { name: 'auth.signUp' }));

    await waitFor(() =>
      expect(useAuthStore.getState().accessToken).toBe('mock-access-token'),
    );
  });
});
