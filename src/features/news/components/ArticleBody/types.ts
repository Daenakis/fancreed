import type { StyleProp, ViewStyle } from 'react-native';

export type ArticleBodyProps = {
  /** Article HTML from the club site. */
  html: string;
  style?: StyleProp<ViewStyle>;
};
