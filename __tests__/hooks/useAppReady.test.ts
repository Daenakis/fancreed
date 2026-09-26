import { renderHook, waitFor } from '@tests/test-utils';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { useAppReady } from '@/hooks/app/useAppReady';

import * as authStore from '@/store/useAuthStore';

jest.mock('expo-font', () => ({ useFonts: jest.fn() }));
jest.mock('expo-splash-screen', () => ({ hideAsync: jest.fn() }));

const mockUseFonts = useFonts as jest.Mock;

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('useAppReady', () => {
  it('stays not ready and keeps the splash while fonts are loading', () => {
    mockUseFonts.mockReturnValue([false, null]);

    const { result } = renderHook(() => useAppReady());

    expect(result.current).toBe(false);
    expect(SplashScreen.hideAsync).not.toHaveBeenCalled();
  });

  it('becomes ready and hides the splash when fonts load', async () => {
    mockUseFonts.mockReturnValue([true, null]);

    const { result } = renderHook(() => useAppReady());

    await waitFor(() => expect(result.current).toBe(true));
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });

  it('becomes ready when fonts fail to load instead of hanging on the splash', async () => {
    mockUseFonts.mockReturnValue([false, new Error('font missing')]);

    const { result } = renderHook(() => useAppReady());

    await waitFor(() => expect(result.current).toBe(true));
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });

  it('becomes ready when loading auth from storage fails', async () => {
    mockUseFonts.mockReturnValue([true, null]);
    jest
      .spyOn(authStore, 'loadAuthFromStorage')
      .mockRejectedValue(new Error('keychain unavailable'));

    const { result } = renderHook(() => useAppReady());

    await waitFor(() => expect(result.current).toBe(true));
    expect(authStore.loadAuthFromStorage).toHaveBeenCalled();
  });
});
