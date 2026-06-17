/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',

  setupFiles: [
    'react-native-unistyles/mocks',
    '<rootDir>/src/ui/theme/unistyles.ts',
  ],

  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/setup.ts'],

  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],

  moduleNameMapper: {
    '^@bugsnag/expo$': '<rootDir>/__tests__/setup/mocks/bugsnag.ts',
    '^@bugsnag/expo-performance$':
      '<rootDir>/__tests__/setup/mocks/bugsnag-performance.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@env$': '<rootDir>/env.ts',
    '^env$': '<rootDir>/env.ts',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    '\\.svg$': '<rootDir>/__tests__/setup/svgMock.tsx',
    '^expo/src/winter$': '<rootDir>/__tests__/setup/empty.ts',
  },

  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '__tests__/setup/',
  ],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/**',
    '!src/ui/theme/**',
  ],
};

module.exports = config;
