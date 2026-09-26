import type { ReactElement } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type CarouselProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => ReactElement;
  keyExtractor: (item: T, index: number) => string;
  /** Page width as a share of the screen width. Defaults to 0.8. */
  itemWidthRatio?: number;
  /** Gap between pages. Defaults to 12. */
  gap?: number;
  /** Page dots under the carousel. Defaults to `true`. */
  showIndicator?: boolean;
  /** Theme colour of the current dot. Defaults to `foreground`. */
  indicatorColor?: ColorToken;
  /** Called when the user lands on another page. */
  onIndexChange?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
};
