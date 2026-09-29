import { getItem, setItem } from './storage';

/** How long device-cached data stays fresh by default. */
export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Bump when a cached shape changes, so old entries are ignored.
const PREFIX = 'queryCache:v1:';

type Entry<T> = { savedAt: number; data: T };

const readEntry = <T>(key: string) => getItem<Entry<T>>(PREFIX + key);

/**
 * React Query options that keep a query's data on the device (MMKV), for
 * slow-changing data read from third-party sites (squad, player bios).
 * The saved copy shows instantly on launch and is refetched only once it's
 * older than `maxAgeMs`; a failed refetch keeps it on screen.
 *
 * @example
 * queryOptions({ queryKey, ...persistedQuery('squad', () => fetcher(squadsApi.actual())) })
 */
export function persistedQuery<T>(
  key: string,
  fetch: () => Promise<T>,
  maxAgeMs = WEEK_MS,
) {
  return {
    queryFn: async (): Promise<T> => {
      const data = await fetch();
      setItem<Entry<T>>(PREFIX + key, { savedAt: Date.now(), data });
      return data;
    },
    initialData: (): T | undefined => readEntry<T>(key)?.data,
    initialDataUpdatedAt: (): number | undefined => readEntry<T>(key)?.savedAt,
    staleTime: maxAgeMs,
  };
}
