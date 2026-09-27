import * as ImagePicker from 'expo-image-picker';

export type PickedImage = {
  /** Local file, for previews. */
  uri: string;
  /** Raw base64 JPEG, for `setphoto` uploads. */
  base64: string;
};

/**
 * Picks a photo from the library, square-cropped and re-encoded as JPEG
 * (the only type the backend's `setphoto` accepts). `null` when cancelled.
 */
export function usePickImage() {
  return async (): Promise<PickedImage | null> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      // Below 1 the picker re-encodes to JPEG.
      quality: 0.7,
      base64: true,
    });
    const asset = result.canceled ? undefined : result.assets[0];
    return asset?.base64 ? { uri: asset.uri, base64: asset.base64 } : null;
  };
}
