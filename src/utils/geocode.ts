import * as Location from 'expo-location';

/**
 * Map coordinates for a typed address (device geocoder, no permission
 * needed). `null` when the address can't be found.
 */
export async function geocodeAddress(
  address: string,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const [first] = await Location.geocodeAsync(address);
    return first
      ? { latitude: first.latitude, longitude: first.longitude }
      : null;
  } catch {
    return null;
  }
}
