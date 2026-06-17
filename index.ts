import Bugsnag from '@bugsnag/expo';
import BugsnagPerformance from '@bugsnag/expo-performance';
import Constants from 'expo-constants';

import 'expo-router/entry';
import './src/ui/theme/unistyles';

const apiKey = Constants.expoConfig?.extra?.bugsnag?.apiKey;

if (apiKey) {
  Bugsnag.start({ apiKey });
  BugsnagPerformance.start({ apiKey });
}
