jest.mock('expo-secure-store', () => {
  const mockStore = new Map<string, string>();

  return {
    getItemAsync: jest.fn((key: string) =>
      Promise.resolve(mockStore.get(key) ?? null),
    ),
    setItemAsync: jest.fn((key: string, value: string) => {
      mockStore.set(key, value);
      return Promise.resolve();
    }),
    deleteItemAsync: jest.fn((key: string) => {
      mockStore.delete(key);
      return Promise.resolve();
    }),
  };
});
