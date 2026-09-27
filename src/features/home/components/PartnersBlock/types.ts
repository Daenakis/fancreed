import type { StyleProp, ViewStyle } from 'react-native';

import type { Sponsor } from '@/types/api';

export type PartnersBlockProps = {
  /** Opens the partner's site (`sponsor.url`). */
  onOpenPartner: (sponsor: Sponsor) => void;
  style?: StyleProp<ViewStyle>;
};
