import type { StyleProp, ViewStyle } from 'react-native';

export type ChoiceOption<T extends string | number> = {
  label: string;
  value: T;
};

/**
 * - `segmented` (default): 2–3 options side by side as joined buttons
 *   (gender, club visibility).
 * - `radio`: circle + label per option, two per row, labels may wrap
 *   (poll answers).
 * - `tabs`: text tabs with an underline under the selected one (screen
 *   sections, e.g. upcoming matches / results).
 */
export type ChoiceGroupVariant = 'segmented' | 'radio' | 'tabs';

export type ChoiceGroupProps<T extends string | number> = {
  options: ChoiceOption<T>[];
  /** Selected value; nothing is selected when it matches no option. */
  value: T | null | undefined;
  onChange: (value: T) => void;
  /** Defaults to `segmented`. */
  variant?: ChoiceGroupVariant;
  /** Caption under the group, e.g. "Gender *". */
  caption?: string;
  style?: StyleProp<ViewStyle>;
};

export type ChoiceItemProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export type SegmentProps = ChoiceItemProps & {
  first: boolean;
  last: boolean;
};
