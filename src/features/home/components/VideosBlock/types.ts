import type { StyleProp, ViewStyle } from 'react-native';

export type VideosBlockProps = {
  /** Opens a video link, e.g. YouTube. */
  onOpenVideo: (url: string) => void;
  style?: StyleProp<ViewStyle>;
};
