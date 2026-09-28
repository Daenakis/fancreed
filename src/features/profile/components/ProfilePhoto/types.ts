import type { StyleProp, ViewStyle } from 'react-native';

export type ProfilePhotoProps = {
  /** Photo URL (or a local file right after picking); a placeholder without it. */
  photo?: string | null;
  /** Spinner over the photo while it uploads. Defaults to `false`. */
  uploading?: boolean;
  /** Tap on the photo or its badge: pick a new one. */
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};
