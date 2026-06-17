import './mocks/expo-router';
import './mocks/expo-secure-store';
import './mocks/i18next';
import './mocks/mmkv';
import './mocks/react-query';

jest.mock('react-native-reanimated', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native-reanimated/mock'),
);

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
