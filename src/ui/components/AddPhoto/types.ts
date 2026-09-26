import type { StyleProp, ViewStyle } from 'react-native';

export type AddPhotoProps = {
  /** Opens the picker — the caller handles camera/gallery and upload. */
  onPress: () => void;
  /** Current photo URL; a placeholder is shown when missing. */
  photo?: string | null;
  /** View-only: no camera icon, presses ignored. Defaults to `false`. */
  disabled?: boolean;
  /** Shows a spinner over the tile while the photo uploads. Defaults to `false`. */
  uploading?: boolean;
  style?: StyleProp<ViewStyle>;
};
