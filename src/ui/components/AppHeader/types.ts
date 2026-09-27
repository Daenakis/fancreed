import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

export type AppHeaderProps = {
  /** Club logo, centred on the screen (not between the side buttons). */
  logo: ImageSourcePropType;
  /** Extra (e.g. animated) style for the logo, like a fade-in. */
  logoStyle?: StyleProp<AnimatedStyle<ImageStyle>>;
  /** Burger menu. Shown inactive when missing. */
  onMenuPress?: () => void;
  /** Profile avatar. Shown inactive when missing. */
  onProfilePress?: () => void;
  /** Dev-only helper: long-press on the avatar. */
  onProfileLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
