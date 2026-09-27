import type { StyleProp, ViewStyle } from 'react-native';

import type { ClubFormState } from '../../hooks';

export type ClubFormProps = {
  /** From `useClubForm()` — the screen submits it. */
  form: ClubFormState;
  /** Picked logo (local file URI or URL). */
  photo?: string | null;
  /** Opens the photo picker. */
  onPickPhoto: () => void;
  style?: StyleProp<ViewStyle>;
};

export type PhotoPickerProps = {
  photo?: string | null;
  onPress: () => void;
};
