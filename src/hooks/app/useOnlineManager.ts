import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { useEffect } from 'react';

/**
 * Connects React Query's `onlineManager` to the device network state.
 *
 * Why: React Query pauses queries and mutations while the device is offline,
 *      and automatically retries them when the connection is restored.
 *      On the web this works out of the box via `navigator.onLine`, but
 *      React Native has no such API — we bridge the gap with `expo-network`.
 *
 * @see https://tanstack.com/query/v5/docs/framework/react/react-native#online-status-management
 */
export function useOnlineManager() {
  useEffect(() => {
    const eventSubscription = Network.addNetworkStateListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });

    return () => eventSubscription.remove();
  }, []);
}
