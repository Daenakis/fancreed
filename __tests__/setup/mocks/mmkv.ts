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
  return {
    createMMKV: jest.fn(() => instance),
    MMKV: jest.fn(() => instance),
  };
});
