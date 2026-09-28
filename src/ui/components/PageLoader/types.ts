import type { StyleProp, ViewStyle } from 'react-native';

export type PageLoaderProps = {
  /** Logo width in px (height keeps the logo's ratio). Defaults to 88. */
  size?: number;
  style?: StyleProp<ViewStyle>;
};
