import { router } from 'expo-router';

/**
 * Back arrow of a detail screen: pops the stack, or returns to Home when
 * there's nothing to pop (e.g. the screen was opened from a deep link).
 */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
