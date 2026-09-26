import type { StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

/** A social link as the backend sends it (`GET socials/list`). */
export type SocialLink = {
  /** e.g. "facebook", "instagram", "telegram", "web", "youtube". */
  name: string;
  url: string;
};

export type SocialLinksProps = {
  links: SocialLink[];
  /** Called with the pressed link — open it in a browser or web view. */
  onOpen: (link: SocialLink) => void;
  /** Shows a BlockHeader with this title above the icons. */
  title?: string;
  /** Theme colour of the icons. Defaults to `foreground`. */
  iconColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
};
