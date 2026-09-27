import type { StyleProp, ViewStyle } from 'react-native';

import type { MatchCardProps } from '@/features/matches';

export type MatchesBlockProps = Pick<
  MatchCardProps,
  'onOpenLink' | 'onOpenLineup' | 'onOpenVideos'
> & {
  style?: StyleProp<ViewStyle>;
};
