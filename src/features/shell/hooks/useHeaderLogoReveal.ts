import { makeMutable, useAnimatedStyle } from 'react-native-reanimated';

/**
 * Opacity of the tab headers' club logo. WelcomeBack hides it while its own
 * logo flies up, then fades it in as that logo lands — a crossfade that
 * hides any sub-pixel difference between the two on any device.
 */
export const headerLogoOpacity = makeMutable(1);

/** Animated style for the header logo (see `headerLogoOpacity`). */
export function useHeaderLogoReveal() {
  return useAnimatedStyle(() => ({ opacity: headerLogoOpacity.value }));
}
