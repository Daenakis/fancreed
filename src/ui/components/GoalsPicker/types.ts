import type { StyleProp, ViewStyle } from 'react-native';

export type GoalsPickerProps = {
  /** Goals 0–9, or `null` while not picked yet (shows "?"). */
  value: number | null;
  onChange: (value: number) => void;
  /** Side of the arrows. Defaults to `right`. */
  buttonsSide?: 'left' | 'right';
  /** Hides the arrows (prediction already placed). Defaults to `false`. */
  readOnly?: boolean;
  /** Screen-reader name, e.g. the team. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};
