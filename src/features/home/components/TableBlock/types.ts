import type { StyleProp, ViewStyle } from 'react-native';

export type TableBlockProps = {
  /** Opens the full league table. */
  onShowAll: () => void;
  style?: StyleProp<ViewStyle>;
};
