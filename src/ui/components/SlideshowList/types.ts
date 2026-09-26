import type { Ref } from 'react';
import type { FlatList, FlatListProps } from 'react-native';

export type SlideshowListProps<T> = Omit<
  FlatListProps<T>,
  'horizontal' | 'onViewableItemsChanged' | 'initialScrollIndex'
> & {
  /** Time each item stays before advancing, ms. Defaults to 2500. */
  intervalMs?: number;
  /** Quiet time after a touch before auto-advance resumes, ms. Defaults to 6000. */
  resumeAfterMs?: number;
  /** First item shown and where the loop restarts. Defaults to 0. */
  startIndex?: number;
  /** Advance right-to-left. Defaults to `false`. */
  reversed?: boolean;
  ref?: Ref<FlatList<T>>;
};
