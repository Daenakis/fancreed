import Bugsnag from '@bugsnag/expo';
import BugsnagPerformance from '@bugsnag/expo-performance';
import Constants from 'expo-constants';

/**
 * Side-effect module: starts BugSnag when an API key is configured.
 * Imported from the entry file (index.ts) before `expo-router/entry`,
 * so errors thrown while route modules load are reported too.
 */
const apiKey = Constants.expoConfig?.extra?.bugsnag?.apiKey;

if (apiKey) {
  Bugsnag.start({ apiKey });
  BugsnagPerformance.start({ apiKey });
}
