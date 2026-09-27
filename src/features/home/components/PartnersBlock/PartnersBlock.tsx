import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { BlockHeader, LoadingMore, TileCarousel } from '@/ui/components';

import { useSponsorsQuery } from '@/hooks';

import type { PartnersBlockProps } from './types';

/** Home-screen partners: logo tiles in pages of three; tap opens the site. */
export function PartnersBlock({ onOpenPartner, style }: PartnersBlockProps) {
  const { t } = useTranslation();
  const { data: sponsors, isPending } = useSponsorsQuery();

  if (isPending) return <LoadingMore loading />;
  if (!sponsors?.length) return null;

  return (
    <View style={[styles.container, style]}>
      <BlockHeader title={t('home.partnersTitle')} />
      <TileCarousel
        items={sponsors.map((sponsor) => ({
          key: sponsor._id,
          title: sponsor.name,
          image: sponsor.image,
          sponsor,
        }))}
        onPressItem={(item) => onOpenPartner(item.sponsor)}
        // Grey frames keep white logos visible on light backgrounds.
        tileSurface="muted"
        style={styles.tiles}
      />
    </View>
  );
}

PartnersBlock.displayName = 'PartnersBlock';

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
