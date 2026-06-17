import { getItem, removeItem, setItem } from '@/utils/storage';

describe('storage helpers', () => {
  describe('setItem + getItem', () => {
    it('stores and retrieves an object', () => {
      setItem('user', { id: '1', name: 'Test' });

      const result = getItem<{ id: string; name: string }>('user');

      expect(result).toEqual({ id: '1', name: 'Test' });
    });

    it('stores and retrieves a number', () => {
      setItem('count', 42);

      expect(getItem<number>('count')).toBe(42);
    });

    it('stores and retrieves a boolean', () => {
      setItem('onboarded', true);

      expect(getItem<boolean>('onboarded')).toBe(true);
    });

    it('stores and retrieves a string', () => {
      setItem('locale', 'en');

      expect(getItem<string>('locale')).toBe('en');
    });

    it('overwrites existing values', () => {
      setItem('key', 'first');
      setItem('key', 'second');

      expect(getItem<string>('key')).toBe('second');
    });
  });

  describe('getItem', () => {
    it('returns null when the key does not exist', () => {
      expect(getItem('nonexistent-key-abc')).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('removes a previously stored value', () => {
      setItem('temp', 'value');
      removeItem('temp');

      expect(getItem('temp')).toBeNull();
    });
  });
});
