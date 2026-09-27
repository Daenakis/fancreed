import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { LoadingMore, SectionTitle, TileCarousel } from '@/ui/components';

import { useClubsQuery } from '@/hooks';

import type { FanClubsBlockProps } from './types';

/**
 * "Fan clubs": logo tiles (green lion without a logo) in pages of three,
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

  if (isPending) return <LoadingMore loading />;
  if (!clubs?.length && !onCreateClub) return null;

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
      {clubs?.length ? (
        <TileCarousel
          items={clubs.map((club) => ({
            key: club._id,
            title: club.name,
            image: club.origPhoto,
            club,
          }))}
          onPressItem={(item) => onOpenClub(item.club)}
          placeholderIcon="lion"
          tileSurface="brand"
        />
      ) : null}
    </View>
  );
}

FanClubsBlock.displayName = 'FanClubsBlock';
