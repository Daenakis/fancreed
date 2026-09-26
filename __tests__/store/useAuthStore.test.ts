import * as SecureStore from 'expo-secure-store';

import { queryClient } from '@/providers/queryClient';

import { storage } from '@/utils/storage';

import { loadAuthFromStorage, signIn, signOut, useAuthStore } from '@/store';

import { STORAGE_KEYS } from '@/constants';

beforeEach(() => {
  useAuthStore.setState({ accessToken: null });
});

describe('useAuthStore', () => {
  it('starts signed out', () => {
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('stores the token in memory and SecureStore on signIn', async () => {
    await useAuthStore.getState().signIn('test-access');

    expect(useAuthStore.getState().accessToken).toBe('test-access');
    expect(await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN)).toBe(
      'test-access',
    );
  });

  it('clears the token everywhere on signOut', async () => {
    await signIn('test-access');

    await signOut();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(
      await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
    ).toBeNull();
  });

  it('replaces the token when signIn is called again', async () => {
    await signIn('first-access');
    await signIn('second-access');

    expect(useAuthStore.getState().accessToken).toBe('second-access');
  });
});

describe('session lifecycle', () => {
  it('clears cached server data on signOut', async () => {
    const clear = jest.spyOn(queryClient, 'clear');
    await signIn('access');

    await signOut();

    expect(clear).toHaveBeenCalled();
  });

  it('drops a leftover token on the first launch after install', async () => {
    storage.remove(STORAGE_KEYS.HAS_LAUNCHED);
    await signIn('leftover-access');
    useAuthStore.setState({ accessToken: null });

    await loadAuthFromStorage();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(
      await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
    ).toBeNull();
  });

  it('restores the saved token on later launches', async () => {
    storage.set(STORAGE_KEYS.HAS_LAUNCHED, true);
    await signIn('saved-access');
    useAuthStore.setState({ accessToken: null });

    await loadAuthFromStorage();

    expect(useAuthStore.getState().accessToken).toBe('saved-access');
  });
});
