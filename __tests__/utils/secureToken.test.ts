import { clearToken, loadToken, saveToken } from '@/utils/secureToken';

describe('secureToken', () => {
  it('returns null when nothing is saved', async () => {
    await clearToken();

    expect(await loadToken()).toBeNull();
  });

  it('returns the saved token when one was saved', async () => {
    await saveToken('abc');

    expect(await loadToken()).toBe('abc');
  });

  it('removes the token when cleared', async () => {
    await saveToken('abc');

    await clearToken();

    expect(await loadToken()).toBeNull();
  });
});
