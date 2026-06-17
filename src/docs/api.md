# API

Axios instance, API methods, and the `fetcher` utility for React Query.

## Structure

```
src/api/
├── api.ts       # Axios instance + endpoint methods
├── fetcher.ts   # Unwraps AxiosResponse<T> → T
└── index.ts     # Barrel re-export
```

## Conventions

| Rule                       | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| One `axiosInstance`        | All requests go through a single configured instance     |
| Group methods by domain    | `api.login(...)`, `api.getUser(...)`, etc.               |
| Types from `@/types`       | Import request/response types from `@/types/api`         |
| Use `fetcher()` in queryFn | Wrap `api.*` calls with `fetcher()` to unwrap `res.data` |

## Interceptors — JWT Refresh Token Pattern

When your API uses JWT with access + refresh tokens, add Axios interceptors to handle token attachment and automatic refresh. Below is a production-ready pattern based on [this guide](https://ahmad2point0.medium.com/how-to-handle-jwt-refresh-tokens-automatically-with-axios-react-native-expo-next-js-fc69e85b4ff6).

### Step 1 — Attach access token (request interceptor)

Pull the access token from Zustand and add it to every outgoing request:

```ts
import { useAuthStore } from '@/store';

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
```

### Step 2 — Auto-refresh on 401 (response interceptor)

Intercept 401 responses, refresh the token, and retry the original request:

```ts
import axios from 'axios';
import { signOut, useAuthStore } from '@/store';

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, signIn } = useAuthStore.getState();

      if (!refreshToken) {
        await signOut();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${CONFIG.API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        await signIn(data.access_token, data.refresh_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return axiosInstance(originalRequest);
      } catch {
        await signOut();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
```

### How it works

1. Every request automatically gets `Authorization: Bearer <token>` via the request interceptor.
2. If the API responds with `401`, the response interceptor kicks in:
   - Calls the refresh endpoint with the stored refresh token
   - Updates both tokens via `signIn()` (persisted to SecureStore)
   - Retries the original request with the new access token
3. If the refresh itself fails → the user is signed out.
4. The `_retry` flag prevents infinite refresh loops.

### Key points

- Use a **raw `axios.post`** (not `axiosInstance`) for the refresh call to avoid interceptor recursion.
- Tokens are stored in SecureStore via `@/utils/secureToken` and synced to `useAuthStore`.
- Call `signOut()` from `@/store` — it clears the token and triggers navigation via `Stack.Protected`.

> Full article: [How to Handle JWT Refresh Tokens Automatically with Axios](https://ahmad2point0.medium.com/how-to-handle-jwt-refresh-tokens-automatically-with-axios-react-native-expo-next-js-fc69e85b4ff6)

## Docs

- [Axios interceptors](https://axios-http.com/docs/interceptors)
- [TanStack React Query](https://tanstack.com/query/latest)
