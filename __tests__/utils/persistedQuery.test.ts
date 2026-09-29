import { persistedQuery, storage, WEEK_MS } from '@/utils';

describe('persistedQuery', () => {
  beforeEach(() => {
    storage.clearAll();
    jest.useFakeTimers().setSystemTime(new Date('2026-09-30T12:00:00Z'));
  });

  afterEach(() => jest.useRealTimers());

  it('has no initial data when nothing is saved yet', () => {
    const options = persistedQuery('squad', jest.fn());

    expect(options.initialData()).toBeUndefined();
    expect(options.initialDataUpdatedAt()).toBeUndefined();
  });

  it('saves fetched data and serves it with its save time on the next launch', async () => {
    await persistedQuery('squad', async () => ['a', 'b']).queryFn();

    const next = persistedQuery<string[]>('squad', jest.fn());

    expect(next.initialData()).toEqual(['a', 'b']);
    expect(next.initialDataUpdatedAt()).toBe(Date.now());
  });

  it('keeps the saved data when a refetch fails', async () => {
    await persistedQuery('squad', async () => ['a']).queryFn();
    const failing = persistedQuery<string[]>('squad', () =>
      Promise.reject(new Error('offline')),
    );

    await expect(failing.queryFn()).rejects.toThrow('offline');
    expect(failing.initialData()).toEqual(['a']);
  });

  it('keeps data fresh for a week unless told otherwise', () => {
    expect(persistedQuery('squad', jest.fn()).staleTime).toBe(WEEK_MS);
    expect(persistedQuery('squad', jest.fn(), 1000).staleTime).toBe(1000);
  });

  it('keeps separate entries per key', async () => {
    await persistedQuery('a', async () => 1).queryFn();

    expect(persistedQuery('b', jest.fn()).initialData()).toBeUndefined();
  });
});
