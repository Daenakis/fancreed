import type { StyleProp, ViewStyle } from 'react-native';

import type { FanLevel } from '@/types/api';

export type ProfileCardProps = {
  name: string;
  photo?: string | null;
  /** Level row with the progress to the next one; hidden without it. */
  level?: FanLevel | null;
  onEdit: () => void;
  /** Avatar tap: pick a new photo. */
  onChangePhoto?: () => void;
  /** Shows a spinner over the avatar while the photo uploads. */
  photoUploading?: boolean;
  style?: StyleProp<ViewStyle>;
};
