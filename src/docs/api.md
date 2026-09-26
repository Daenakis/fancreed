# API

Backend: `https://app.fancreed.com/api/` (set per build in `env.ts`, overridable with `EXPO_PUBLIC_API_URL`). Contract: the backend apidoc (`/apidoc`, login required) — ask Denis for access.

## Structure

```
src/api/
├── client.ts            # axiosInstance: base URL, JSON, auth interceptors
├── authInterceptors.ts  # Bearer token on requests; 401 → signOut
├── endpoints/
│   ├── auth.ts          # authApi — one method per apidoc endpoint
│   └── index.ts         # add clubs.ts, events.ts … per apidoc group
├── errors.ts            # backend message → ApiErrorCode → i18n key; toFormError()
├── fetcher.ts           # AxiosResponse<T> → T
└── index.ts
src/types/api/           # request/response types per apidoc group (+ common.ts)
src/hooks/query/<group>/ # one mutation/query hook per endpoint (mutationOptions + hook)
```

## Conventions

| Rule                         | Description                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| One endpoints file per group | Mirrors the apidoc groups (`auth`, `clubs`, `events`…) — `xxxApi.method()` returns `AxiosResponse`   |
| Hooks wrap endpoints         | `mutationOptions`/`queryOptions` + `useXxx` hook in `src/hooks/query/<group>/`; always via `fetcher` |
| Side effects                 | Cache/session effects in the hook (`onSuccess`); navigation and UI feedback in the screen            |
| Errors                       | Never read `error.response.data.message` in screens — use `getApiErrorCode` / `toFormError`          |
| Types                        | Field names exactly as the backend sends them (e.g. `access_token`)                                  |

## Auth

| Case                          | Behaviour                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| Token                         | One JWT (`access_token`, ~90 days). No refresh token — the backend has no refresh endpoint |
| Every request                 | `Authorization: Bearer <token>` when signed in                                             |
| 401 with the current token    | `signOut()` → token + React Query cache cleared, `Stack.Protected` shows sign-in           |
| 401 with an older token       | Ignored (user signed in again meanwhile)                                                   |
| Login with `activated: false` | No session; the screen opens email activation (4-digit code), then signs in automatically  |

### Session lifecycle (`useAuthStore`)

- `signIn(accessToken)` — persists to SecureStore and updates memory (called by `useLoginMutation` for activated accounts)
- `signOut()` — clears memory, React Query cache, and SecureStore (`useLogoutMutation` calls it even if the server call fails)
- `loadAuthFromStorage()` — called at startup; on the first launch after install it wipes a leftover token (iOS Keychain survives uninstall, MMKV doesn't)

Tests: `__tests__/api/`, `__tests__/store/useAuthStore.test.ts`, `__tests__/features/auth/`.

## Docs

- [Axios interceptors](https://axios-http.com/docs/interceptors)
- [TanStack Query — mutationOptions](https://tanstack.com/query/v5/docs/framework/react/reference/mutationOptions)
- [TanStack Query — queryOptions](https://tanstack.com/query/v5/docs/react/reference/queryOptions)
