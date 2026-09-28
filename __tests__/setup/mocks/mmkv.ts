jest.mock('react-native-nitro-modules', () => ({}));

jest.mock('react-native-mmkv', () => {
  const store = new Map<string, string>();
  const instance = {
    getString: jest.fn((key: string) => store.get(key) ?? undefined),
    set: jest.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    remove: jest.fn((key: string) => {
      store.delete(key);
    }),
    delete: jest.fn((key: string) => {
      store.delete(key);
    }),
    contains: jest.fn((key: string) => store.has(key)),
    getAllKeys: jest.fn(() => Array.from(store.keys())),
    clearAll: jest.fn(() => {
      store.clear();
    }),
  };
  // State-backed stand-ins for the MMKV React hooks (same store).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useState } = require('react') as typeof import('react');
  const useMMKVString = (key: string) => {
    const [value, setValue] = useState<string | undefined>(store.get(key));
    const set = (next: string | undefined) => {
      if (next === undefined) store.delete(key);
      else store.set(key, next);
      setValue(next);
    };
    return [value, set] as const;
  };
  const useMMKVBoolean = (key: string) => {
    const [value, setValue] = useState<boolean | undefined>(
      store.has(key) ? String(store.get(key)) === 'true' : undefined,
    );
    const set = (next: boolean) => {
      store.set(key, String(next));
      setValue(next);
    };
    return [value, set] as const;
  };
  return {
    createMMKV: jest.fn(() => instance),
    MMKV: jest.fn(() => instance),
    useMMKVString,
    useMMKVBoolean,
    /** Test helper (not a mock, so mock resets can't break it): empties the store. */
    __clearStore: () => store.clear(),
  };
});
