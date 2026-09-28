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
}));

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
