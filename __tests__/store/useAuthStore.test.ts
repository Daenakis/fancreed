import { signIn, signOut, useAuthStore } from '@/store';

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
