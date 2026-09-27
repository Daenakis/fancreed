import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type BottomSheetProps = {
  visible: boolean;
  /** Backdrop tap, Android back and the parent closing it. */
  onClose: () => void;
  /** Heading at the top of the sheet. */
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};
