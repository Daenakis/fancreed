# Testing

Jest + React Native Testing Library for unit and component tests.

## What to Test

### Required

| What                                     | Type             | Why                                                 |
| ---------------------------------------- | ---------------- | --------------------------------------------------- |
| **Utilities** (`src/utils/`)             | Unit             | Pure functions with no UI — fast, stable, high ROI  |
| **UI components** (`src/ui/components/`) | Unit / Component | Reusable across the app — regressions are expensive |

Every utility function and every shared component **must** have a test file.

### Recommended (not required)

| What                 | Type        | When                                                                 |
| -------------------- | ----------- | -------------------------------------------------------------------- |
| **Critical screens** | Integration | Auth flows, onboarding, checkout — anything that blocks the user     |
| **Zustand stores**   | Unit        | When the store has non-trivial logic (computed values, side effects) |

### Not Required

| What                      | Why                                                           |
| ------------------------- | ------------------------------------------------------------- |
| Zod schemas               | TypeScript + Zod runtime validation already catches issues    |
| Custom hooks              | Test indirectly through the components/screens that use them  |
| React Query hooks         | Test indirectly; mock at the API level, not at the hook level |
| Route files (`src/app/`)  | Thin re-exports — nothing to test                             |
| Barrel files (`index.ts`) | Zero logic                                                    |
| Theme / config            | Static objects — TypeScript is enough                         |
| Snapshot tests            | Fragile, break on any style change, give false confidence     |

## Conventions

| Rule                              | Description                                                     |
| --------------------------------- | --------------------------------------------------------------- |
| Test behavior, not implementation | Query by `getByRole`, `getByText` — not `getByTestId`           |
| One test = one scenario           | Don't pack 5 assertions into one `it()`                         |
| Mocks — minimum                   | Only mock native modules and external APIs                      |
| Mirror `src/` structure           | `src/utils/fetcher.ts` → `__tests__/utils/fetcher.test.ts`      |
| Use `renderWithProviders`         | Import `render` from `@tests/test-utils` — includes QueryClient |

## Naming

Test descriptions follow the pattern: **what** + **when** + **expected result**.

```ts
// ✅ Good
it('calls signIn with token when the button is pressed', ...);
it('returns null when storage key does not exist', ...);
it('renders error message when form validation fails', ...);

// ❌ Bad
it('works', ...);
it('test signIn', ...);
it('should render correctly', ...);
```

## Folder Structure

```
__tests__/
├── setup/                        # Mocks and Jest config
│   ├── mocks/
│   │   ├── expo-router.ts
│   │   ├── i18next.ts
│   │   ├── mmkv.ts
│   │   └── react-query.ts
│   ├── setup.ts                  # Global beforeEach / afterEach
│   ├── svgMock.tsx
│   └── empty.ts
├── test-utils.tsx                # renderWithProviders helper
├── utils/                        # Unit tests for src/utils/
│   └── validateEnv.test.ts
├── ui/                           # Component tests for src/ui/components/
│   └── ErrorFallback.test.tsx
├── store/                        # Store tests (recommended)
│   └── useAuthStore.test.ts
└── features/                     # Screen tests (critical flows only)
    └── auth/
        └── SignInScreen.test.tsx
```

## Running Tests

```bash
yarn test              # Run all tests
yarn test:watch        # Watch mode
yarn test:coverage     # Generate coverage report
```

## Quick Example

**Utility test** (`__tests__/utils/fetcher.test.ts`):

```ts
import { fetcher } from '@/api/fetcher';

describe('fetcher', () => {
  it('unwraps AxiosResponse to data', async () => {
    const mockResponse = { data: { id: '1', name: 'Test' }, status: 200 };
    const result = await fetcher(Promise.resolve(mockResponse));

    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('rejects when the request fails', async () => {
    await expect(
      fetcher(Promise.reject(new Error('Network Error'))),
    ).rejects.toThrow('Network Error');
  });
});
```

**Component test** (`__tests__/ui/ErrorFallback.test.tsx`):

```tsx
import { render, fireEvent } from '@tests/test-utils';

import { ErrorFallback } from '@/ui/components';

describe('ErrorFallback', () => {
  const error = new Error('Something broke');

  it('renders the error message', () => {
    const { getByText } = render(<ErrorFallback error={error} />);

    expect(getByText('Something broke')).toBeTruthy();
  });

  it('calls onRetry when the button is pressed', () => {
    const onRetry = jest.fn();
    const { getByRole } = render(
      <ErrorFallback error={error} onRetry={onRetry} />,
    );

    fireEvent.press(getByRole('button'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides the retry button when onRetry is not provided', () => {
    const { queryByRole } = render(<ErrorFallback error={error} />);

    expect(queryByRole('button')).toBeNull();
  });
});
```

## Docs

- [Jest 30](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing React Native (official)](https://reactnative.dev/docs/testing-overview)
