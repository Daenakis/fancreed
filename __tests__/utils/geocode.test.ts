import * as Location from 'expo-location';

import { geocodeAddress } from '@/utils';

describe('geocodeAddress', () => {
  it('returns the first match coordinates', async () => {
    jest.mocked(Location.geocodeAsync).mockResolvedValue([
      { latitude: 49.8, longitude: 24.0, accuracy: 1 },
      { latitude: 1, longitude: 1, accuracy: 1 },
    ]);

    await expect(geocodeAddress('Stryiska 199, Lviv')).resolves.toEqual({
      latitude: 49.8,
      longitude: 24.0,
    });
  });

  it('returns null when nothing is found', async () => {
    jest.mocked(Location.geocodeAsync).mockResolvedValue([]);

    await expect(geocodeAddress('nowhere')).resolves.toBeNull();
  });

  it('returns null when the geocoder fails', async () => {
    jest.mocked(Location.geocodeAsync).mockRejectedValue(new Error('offline'));

    await expect(geocodeAddress('x')).resolves.toBeNull();
  });
});
