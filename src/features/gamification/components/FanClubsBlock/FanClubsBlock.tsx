import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { BlockHeader, LoadingMore, TileCarousel } from '@/ui/components';

import { useClubsQuery } from '@/hooks';

import type { FanClubsBlockProps } from './types';

/** Fan clubs as logo tiles; "+" creates a club when the fan has none. */
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

  if (isPending) return <LoadingMore loading />;
  if (!clubs?.length && !onCreateClub) return null;

  return (
    <View style={[styles.container, style]}>
      <BlockHeader title={t('club.fanClubsTitle')} />
      <TileCarousel
        items={(clubs ?? []).map((club) => ({
          key: club._id,
          title: club.name,
          image: club.origPhoto,
          club,
        }))}
        onPressItem={(item) => onOpenClub(item.club)}
        onAdd={onCreateClub}
        addLabel={t('club.createClub')}
        tileSurface="muted"
        style={styles.tiles}
      />
    </View>
  );
}

FanClubsBlock.displayName = 'FanClubsBlock';

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    paddingBottom: theme.spacing(4),
  },
  tiles: {
    alignSelf: 'stretch',
    marginTop: theme.spacing(3),
  },
}));
