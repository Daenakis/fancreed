import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Skeleton } from '@/ui/components';

import type { MatchCardSkeletonProps } from './types';

/**
 * Loading placeholder in the shape of a `compact` MatchCard (calendar):
 * league line, two crests with date and time between them, three buttons.
 */
export function MatchCardSkeleton({ style }: MatchCardSkeletonProps) {
  const { theme } = useUnistyles();
  const crest = theme.spacing(10);

  return (
    <View style={[styles.card, style]}>
      <Skeleton width="55%" height={theme.spacing(4)} />
      <View style={styles.teams}>
        <Skeleton width={crest} height={crest} radius="full" />
        <View style={styles.center}>
          <Skeleton width={theme.spacing(16)} height={theme.spacing(3)} />
          <Skeleton width={theme.spacing(24)} height={theme.spacing(6.5)} />
        </View>
        <Skeleton width={crest} height={crest} radius="full" />
      </View>
      <View style={styles.actions}>
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            height={theme.spacing(8.5)}
            radius="md"
            style={styles.action}
          />
        ))}
      </View>
    </View>
  );
}

MatchCardSkeleton.displayName = 'MatchCardSkeleton';

// Mirrors MatchCard's `compact` card (styles.row / rowTeams / rowActions).
const styles = StyleSheet.create((theme) => ({
  card: {
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mintSurface,
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing(1.5),
  },
  action: {
    flex: 1,
  },
}));
