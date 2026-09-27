import type { StyleProp, ViewStyle } from 'react-native';

import type { ClubFormValues } from '@/schemas';

export type ClubFormProps = {
  /** Called with valid values when Save is pressed. */
  onSubmit: (values: ClubFormValues) => void;
  /** Picked logo (URL or local file URI). */
  photo?: string | null;
  /** Opens the photo picker; the tile is view-only without it. */
  onPickPhoto?: () => void;
  /** Shows a spinner on Save. Defaults to `false`. */
  submitting?: boolean;
  /** Server error under the Save button (already translated). */
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
};
