import type {
  ImageProps,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';

/** Which part of a `cover` picture stays in view when it's cropped. */
export type RemoteImagePosition = 'center' | 'top';

export type RemoteImageProps = Omit<ImageProps, 'source' | 'style'> & {
  /** URL (`{ uri }`) or a local image. Only URLs get the loading skeleton. */
  source: ImageSourcePropType;
  /**
   * `cover` only: `top` keeps the top edge (heads in photos) instead of
   * cropping evenly. Defaults to `center`.
   */
  position?: RemoteImagePosition;
  /** The image box: size, radius, margins. */
  style?: StyleProp<ViewStyle>;
};
