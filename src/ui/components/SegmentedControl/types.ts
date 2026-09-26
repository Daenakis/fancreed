import type { StyleProp, ViewStyle } from 'react-native';

export type SegmentedOption<T extends string | number> = {
  label: string;
  value: T;
};

export type SegmentedControlProps<T extends string | number> = {
  /** 2–3 options, shown side by side. */
  options: SegmentedOption<T>[];
  /** Selected value; nothing is selected when it matches no option. */
  value: T | null | undefined;
  onChange: (value: T) => void;
  /** Caption under the control, e.g. "Gender *". */
  caption?: string;
  style?: StyleProp<ViewStyle>;
};

export type SegmentProps = {
  label: string;
  selected: boolean;
  first: boolean;
  last: boolean;
  onPress: () => void;
};
