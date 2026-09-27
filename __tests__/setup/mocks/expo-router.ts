// One shared router so tests can assert navigation via `useRouter()`.
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  navigate: jest.fn(),
  dismissTo: jest.fn(),
  canGoBack: jest.fn(() => false),
};

jest.mock('expo-router', () => ({
  router: mockRouter,
  useRouter: () => mockRouter,
  useSegments: () => [],
  usePathname: jest.fn(() => '/'),
  // Tests set route params with jest.mocked(useLocalSearchParams).mockReturnValue(…).
  useLocalSearchParams: jest.fn(() => ({})),
  Link: 'Link',
  Slot: 'Slot',
  Stack: { Screen: 'Screen' },
  Tabs: { Screen: 'Screen' },
  Redirect: 'Redirect',
}));

// Headless tabs (the tab shell) — only rendered by the router, never in tests.
jest.mock('expo-router/ui', () => ({
  Tabs: 'Tabs',
  TabList: 'TabList',
  TabSlot: 'TabSlot',
  TabTrigger: 'TabTrigger',
}));
