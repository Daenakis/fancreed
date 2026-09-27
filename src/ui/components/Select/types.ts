import type { StyleProp, ViewStyle } from 'react-native';

import type { ChoiceOption } from '../ChoiceGroup';

export type SelectProps<T extends string | number> = {
  options: ChoiceOption<T>[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  /** Screen-reader name of the field and heading of the sheet. */
  label: string;
  /** Shown while nothing is picked. */
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

export type SelectOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};
