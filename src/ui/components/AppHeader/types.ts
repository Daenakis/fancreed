import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

export type AppHeaderProps = {
  /** Club logo in the centre. */
  logo: ImageSourcePropType;
  /** Burger menu. Shown inactive when missing. */
  onMenuPress?: () => void;
  /** Profile avatar. Shown inactive when missing. */
  onProfilePress?: () => void;
  /** Dev-only helper: long-press on the avatar. */
  onProfileLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
