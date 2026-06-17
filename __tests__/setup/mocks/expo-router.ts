jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  }),
  useSegments: () => [],
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Slot: 'Slot',
  Stack: { Screen: 'Screen' },
  Tabs: { Screen: 'Screen' },
  Redirect: 'Redirect',
}));
