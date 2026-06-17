import type { AxiosResponse } from 'axios';

/**
 * Unwraps `AxiosResponse<T>` → `T` for use in React Query.
 *
 * @example
 * queryFn:    () => fetcher(api.getUser('123'))
 * mutationFn: (p) => fetcher(api.login(p))
 */
export function fetcher<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
  return request.then((res) => res.data);
}
