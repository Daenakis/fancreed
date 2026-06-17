# Query Hooks

TanStack React Query hooks for server state — fetching, caching, and mutations. Client-only state (UI, theme) lives in Zustand, not here.

## Conventions

| Rule                         | Description                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| One hook per resource/action | Flat: `use[Resource]Query.ts` / `use[Action]Mutation.ts`, or grouped: `[resource]/` folder with queries and mutations inside |
| Re-export from index         | All hooks go through `index.ts`                                                                                              |
| Query keys as enum           | Define in `src/types/enums.ts`, import via `@/types`                                                                         |
| Invalidate on logout         | Clear relevant queries when auth token is removed                                                                            |
| Use `fetcher()` in queryFn   | Wrap `api.*` calls with `fetcher()` from `@/api` to unwrap `res.data`                                                        |

## Quick Example

```ts
import { useQuery } from '@tanstack/react-query';
import { api, fetcher } from '@/api';
import { QueryKey } from '@/types';

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: [QueryKey.User, id],
    queryFn: () => fetcher(api.getUser(id)),
  });
}
```

Mutation:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher } from '@/api';
import { QueryKey } from '@/types';
import type { LoginRequest } from '@/types/api';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LoginRequest) => fetcher(api.login(params)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.User] });
    },
  });
}
```

## `fetcher` utility

`fetcher()` from `@/api` unwraps `AxiosResponse<T>` → `T` so you never write `.then((res) => res.data)`:

```ts
// api methods use raw axios — return AxiosResponse<T>
api.getUser(id); // → Promise<AxiosResponse<UserResponse>>

// fetcher unwraps to just the data
fetcher(api.getUser(id)); // → Promise<UserResponse>
```

API methods live in `src/api/api.ts` using raw `axiosInstance.*` calls. See the commented example there.

## Folder Structure

Flat (few hooks):

```
src/hooks/query/
├── index.ts
├── useUserQuery.ts
└── useLoginMutation.ts
```

Grouped by resource (many hooks):

```
src/hooks/query/
├── index.ts
├── user/
│   ├── useUserQuery.ts
│   └── useLoginMutation.ts
├── products/
│   ├── useProductsQuery.ts
│   └── useCreateProductMutation.ts
└── ...
```

## Docs

- [TanStack React Query v5](https://tanstack.com/query/latest)
- [useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
- [useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
