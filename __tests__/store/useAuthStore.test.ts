import * as SecureStore from 'expo-secure-store';

import { queryClient } from '@/providers/queryClient';

import { storage } from '@/utils/storage';

import { loadAuthFromStorage, signIn, signOut, useAuthStore } from '@/store';

import { STORAGE_KEYS } from '@/constants';

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, refreshToken: null });
});

describe('useAuthStore', () => {
  it('starts with null tokens', () => {
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it('sets tokens on signIn', async () => {
    await useAuthStore.getState().signIn('test-access', 'test-refresh');

    expect(useAuthStore.getState().accessToken).toBe('test-access');
    expect(useAuthStore.getState().refreshToken).toBe('test-refresh');
  });

  it('clears tokens on signOut', async () => {
    await useAuthStore.getState().signIn('test-access', 'test-refresh');
    await useAuthStore.getState().signOut();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it('replaces tokens when signIn is called again', async () => {
    await useAuthStore.getState().signIn('first-access', 'first-refresh');
    await useAuthStore.getState().signIn('second-access', 'second-refresh');

    expect(useAuthStore.getState().accessToken).toBe('second-access');
    expect(useAuthStore.getState().refreshToken).toBe('second-refresh');
  });
});

describe('standalone actions', () => {
  it('signIn sets tokens via exported function', async () => {
    await signIn('standalone-access', 'standalone-refresh');

    expect(useAuthStore.getState().accessToken).toBe('standalone-access');
    expect(useAuthStore.getState().refreshToken).toBe('standalone-refresh');
  });

  it('signOut clears tokens via exported function', async () => {
    await signIn('some-access', 'some-refresh');
    await signOut();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });
});

describe('session lifecycle', () => {
  it('persists tokens to SecureStore when setTokens is called', async () => {
    await useAuthStore.getState().setTokens('new-access', 'new-refresh');

    expect(await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN)).toBe(
      'new-access',
    );
    expect(await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN)).toBe(
      'new-refresh',
    );
  });

  it('clears cached server data on signOut', async () => {
    const clear = jest.spyOn(queryClient, 'clear');
    await signIn('access', 'refresh');

    await signOut();

    expect(clear).toHaveBeenCalled();
  });

  it('drops leftover tokens on the first launch after install', async () => {
    storage.remove(STORAGE_KEYS.HAS_LAUNCHED);
    await signIn('leftover-access', 'leftover-refresh');
    useAuthStore.setState({ accessToken: null, refreshToken: null });

    await loadAuthFromStorage();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(
      await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
    ).toBeNull();
  });

  it('restores saved tokens on later launches', async () => {
    storage.set(STORAGE_KEYS.HAS_LAUNCHED, true);
    await signIn('saved-access', 'saved-refresh');
    useAuthStore.setState({ accessToken: null, refreshToken: null });

    await loadAuthFromStorage();

    expect(useAuthStore.getState().accessToken).toBe('saved-access');
    expect(useAuthStore.getState().refreshToken).toBe('saved-refresh');
  });
});
