import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { SectionTitle, Skeleton, TileCarousel } from '@/ui/components';

import { useClubsQuery } from '@/hooks';

import type { FanClubsBlockProps } from './types';

/**
 * "Fan clubs": square logo tiles (green lion without a logo) in pages of three,
 * "+" in the title creates a club.
 */
export function FanClubsBlock({
  onOpenClub,
  onCreateClub,
  style,
}: FanClubsBlockProps) {
  const { t } = useTranslation();
  const { data, isPending } = useClubsQuery();
  // Friends-&-family clubs are invite-only: list them to their members only.
  const clubs = data?.filter(
    (c) => c.opened !== false || c.youMember || c.youOwner,
  );

  if (!isPending && !clubs?.length && !onCreateClub) return null;

  return (
    <View style={style}>
      <SectionTitle
        title={t('club.fanClubsTitle')}
        action={
          onCreateClub
            ? {
                icon: 'plus',
                label: t('club.createClub'),
                onPress: onCreateClub,
              }
            : undefined
        }
      />
      {isPending ? (
        <View style={styles.skeleton}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonTile}>
              <Skeleton width={100} height={100} radius="md" />
              <Skeleton width={64} height={12} />
            </View>
          ))}
        </View>
      ) : clubs?.length ? (
        <TileCarousel
          items={clubs.map((club) => ({
            key: club._id,
            title: club.name,
            image: club.origPhoto,
            club,
          }))}
          onPressItem={(item) => onOpenClub(item.club)}
          variant="square"
          placeholderIcon="lion"
          tileSurface="brand"
        />
      ) : null}
    </View>
  );
}

FanClubsBlock.displayName = 'FanClubsBlock';

// Mirrors TileCarousel's `square` tiles and the page dots' space under them.
const styles = StyleSheet.create((theme) => ({
  skeleton: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    paddingBottom: theme.spacing(4.5),
    overflow: 'hidden',
  },
  skeletonTile: {
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));
