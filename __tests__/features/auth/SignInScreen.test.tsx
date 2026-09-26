import { fireEvent, render, waitFor } from '@tests/test-utils';

import { useAuthStore } from '@/store';

import { SignInScreen } from '@/features/auth';

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, refreshToken: null });
});

describe('SignInScreen', () => {
  it('renders the title and a disabled sign-in button when opened', () => {
    const { getByRole } = render(<SignInScreen />);

    expect(getByRole('header', { name: 'auth.signInTitle' })).toBeTruthy();
    expect(getByRole('button', { name: 'auth.signIn' })).toBeDisabled();
  });

  it('stores tokens when the filled form is submitted', async () => {
    const { getByLabelText, getByRole } = render(<SignInScreen />);

    fireEvent.changeText(getByLabelText('auth.loginPlaceholder'), 'a@b.c');
    fireEvent.changeText(getByLabelText('auth.password'), 'secret');
    await waitFor(() =>
      expect(getByRole('button', { name: 'auth.signIn' })).toBeEnabled(),
    );
    fireEvent.press(getByRole('button', { name: 'auth.signIn' }));

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('mock-access-token');
      expect(useAuthStore.getState().refreshToken).toBe('mock-refresh-token');
    });
  });

  it('leaves the store empty when nothing is submitted', () => {
    render(<SignInScreen />);

    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
