import { act } from '@testing-library/react-native';

import { loginMutationOptions } from '@/hooks';

import { useAuthStore, useSplashStore } from '@/store';

import type { LoginResponse } from '@/types/api';

const loginResponse = (activated: boolean): LoginResponse => ({
  userId: '1',
  activated,
  userRole: 'basic',
  access_token: 'token',
  token_type: 'Bearer',
});

// Runs the login mutation's onSuccess the way React Query would.
const loginSucceeds = (data: LoginResponse) =>
  act(async () => {
    await (
      loginMutationOptions().onSuccess as unknown as (
        d: LoginResponse,
      ) => Promise<void>
    )(data);
  });

beforeEach(() => {
  useSplashStore.setState({ splash: null, newAccount: false });
  jest.spyOn(useAuthStore.getState(), 'signIn').mockResolvedValue();
});

describe('welcome splash after sign-in', () => {
  it('greets a returning fan with "welcome back" from the auth logo', async () => {
    await loginSucceeds(loginResponse(true));

    expect(useSplashStore.getState().splash).toEqual({
      greeting: 'back',
      from: 'auth',
    });
  });

  it('greets a just-activated account as new, once', async () => {
    useSplashStore.getState().markNewAccount();

    await loginSucceeds(loginResponse(true));

    expect(useSplashStore.getState().splash?.greeting).toBe('new');
    expect(useSplashStore.getState().newAccount).toBe(false);
  });

  it('shows no splash for an unactivated account', async () => {
    await loginSucceeds(loginResponse(false));

    expect(useSplashStore.getState().splash).toBeNull();
  });
});

describe('sign-in intro', () => {
  it('is due again after signing out', async () => {
    useSplashStore.getState().consumeSignInIntro();

    await act(() => useAuthStore.getState().signOut());

    expect(useSplashStore.getState().signInIntro).toBe(true);
  });
});
