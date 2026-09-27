import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

/**
 * - `brand` (default): green header, content on a white sheet.
 * - `plain`: white header with dark text (menu).
 */
export type PageLayoutTone = 'brand' | 'plain';

export type PageLayoutProps = {
  title: string;
  /** Back arrow; hidden without it. */
  onBack?: () => void;
  /** Share icon on the right; hidden without it. */
  onShare?: () => void;
  /** Defaults to `brand`. */
  tone?: PageLayoutTone;
  /** Wraps the content in a ScrollView. Defaults to `true`. */
  scrollable?: boolean;
  children: ReactNode;
  /** Pinned under the content, e.g. a Join button. */
  footer?: ReactNode;
  /** Style of the white content area (inside the scroll view when scrollable). */
  contentStyle?: StyleProp<ViewStyle>;
};

export type HeaderButtonProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
  color: string;
};

export type DismissKeyboardProps = {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};
