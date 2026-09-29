import './mocks/expo-router';
import './mocks/expo-secure-store';
import './mocks/i18next';
import './mocks/mmkv';
import './mocks/react-query';

// The real module pulls in Expo's lazy `fetch` global, which Jest rejects
// as an out-of-scope require once the suite has loaded.
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve(true)),
  hideAsync: jest.fn(() => Promise.resolve(true)),
  hide: jest.fn(),
  setOptions: jest.fn(),
}));

// Same lazy-`fetch` problem; tests set results via jest.mocked(…).
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-calendar/legacy', () => ({
  EntityTypes: { EVENT: 'event' },
  requestCalendarPermissionsAsync: jest.fn(),
  getDefaultCalendarAsync: jest.fn(),
  getCalendarsAsync: jest.fn(),
  createEventAsync: jest.fn(),
}));

jest.mock('expo-location', () => ({
  geocodeAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ granted: true, canAskAgain: true }),
  ),
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ granted: true, canAskAgain: true }),
  ),
}));

// Native view; tests read its props (source, handlers) via UNSAFE_getByType.
jest.mock('react-native-webview', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createElement } = require('react') as typeof import('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native') as typeof import('react-native');
  const WebView = (props: object) => createElement(View, props);
  return { WebView };
});

jest.mock(
  'react-native-safe-area-context',
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  () => require('react-native-safe-area-context/jest/mock').default,
);

// Reanimated 4 loads react-native-worklets natively — mock it first.
jest.mock('react-native-worklets', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native-worklets/lib/module/mock'),
);

jest.mock('react-native-reanimated', () => ({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ...require('react-native-reanimated/mock'),
  // Missing from the official mock.
  useReducedMotion: () => false,
  // A no-op in the official mock: return the colour at the nearest end, so
  // styles show the settled state (animations don't run in tests).
  interpolateColor: (value: number, input: number[], output: string[]) =>
    value >= input[input.length - 1]! ? output[output.length - 1] : output[0],
  // Also a no-op in the official mock: plain linear interpolation (clamped
  // to the first/last segment) so animated styles have real values.
  interpolate: (value: number, input: number[], output: number[]) => {
    const last = input.length - 1;
    let i = 0;
    while (i < last - 1 && value > input[i + 1]!) i++;
    const [x0, x1, y0, y1] = [
      input[i]!,
      input[i + 1]!,
      output[i]!,
      output[i + 1]!,
    ];
    if (x1 === x0) return y0;
    return y0 + ((y1 - y0) * (value - x0)) / (x1 - x0);
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
  // Device-cached query data (persistedQuery) must not leak between tests.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  (require('@/utils') as typeof import('@/utils')).storage.clearAll();
});
