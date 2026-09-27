import type { StyleProp, ViewStyle } from 'react-native';

export type DateFieldProps = {
  label: string;
  value: Date | undefined;
  onChange: (date: Date) => void;
  error?: string;
  /** Re-plays the error shake (pass the form's submit count). */
  shakeKey?: number;
  /** Month the calendar opens on when empty. */
  initialView?: Date;
  minDate?: Date;
  maxDate?: Date;
  style?: StyleProp<ViewStyle>;
};
