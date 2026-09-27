import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

import type { AppEvent } from '@/types/api';

export type MatchdayBlockProps = {
  /** Opens a URL (the event location in a maps app). */
  onOpenLink: (url: string) => void;
  style?: StyleProp<ViewStyle>;
};

export type MatchdayEventProps = {
  event: AppEvent;
  joined: boolean;
  onToggleJoin: () => void;
  onRemind: () => void;
  onOpenLink: (url: string) => void;
};

export type ActionTileProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
};
