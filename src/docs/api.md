# API

Axios instance, API methods, and the `fetcher` utility for React Query.

## Structure

```
src/api/
├── api.ts               # Axios instance + endpoint methods
├── authInterceptors.ts  # Bearer token + refresh-on-401
├── fetcher.ts           # Unwraps AxiosResponse<T> → T
└── index.ts             # Barrel re-export
```

## Conventions

| Rule                       | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| One `axiosInstance`        | All requests go through a single configured instance     |
| Group methods by domain    | `api.login(...)`, `api.getUser(...)`, etc.               |
| Types from `@/types`       | Import request/response types from `@/types/api`         |
| Use `fetcher()` in queryFn | Wrap `api.*` calls with `fetcher()` to unwrap `res.data` |

## Auth — token attachment and refresh

Implemented in `src/api/authInterceptors.ts` and wired up in `api.ts`. Nothing to do per request — every call through `axiosInstance` is authenticated.

| Behaviour                         | How                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| Attach token                      | Request interceptor sets `Authorization: Bearer <accessToken>` from `useAuthStore`       |
| Refresh on 401                    | Response interceptor calls `auth/refresh`, saves new tokens (SecureStore), retries once  |
| Concurrent 401s                   | Single-flight — all waiting requests share one refresh call                              |
| Refresh token rejected (4xx)      | `signOut()` → tokens cleared, React Query cache cleared, `Stack.Protected` shows sign-in |
| Refresh fails (network / 5xx)     | Session kept, error propagated — users are never logged out for being offline            |
| 401 while signed out (e.g. login) | No refresh, error propagated to the caller                                               |
| Retried request gets 401 again    | No second refresh (`_retry` flag) — no loops                                             |

The refresh call uses a separate `refreshClient` without interceptors, so a 401 from the refresh endpoint can't trigger another refresh.

Request/response field names live in `src/types/api.ts` (`LoginResponse`, `RefreshRequest`, `RefreshResponse`) — change them there if the backend contract differs.

### Session lifecycle (`useAuthStore`)

- `signIn(access, refresh)` / `setTokens(access, refresh)` — persist to SecureStore and update memory
- `signOut()` — clears memory, React Query cache, and SecureStore
- `loadAuthFromStorage()` — called at startup; on the first launch after install it wipes leftover tokens (iOS Keychain survives uninstall, MMKV doesn't)

Tests: `__tests__/api/authInterceptors.test.ts`, `__tests__/store/useAuthStore.test.ts`.

## Docs

- [Axios interceptors](https://axios-http.com/docs/interceptors)
- [TanStack React Query](https://tanstack.com/query/latest)
