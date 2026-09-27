import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { LoadingMore, SectionTitle, TileCarousel } from '@/ui/components';

import { useSponsorsQuery } from '@/hooks';

import type { PartnersBlockProps } from './types';

/** Home-screen "Our partners": logos in pages of three; tap opens the site. */
export function PartnersBlock({ onOpenPartner, style }: PartnersBlockProps) {
  const { t } = useTranslation();
  const { data: sponsors, isPending } = useSponsorsQuery();

  if (isPending) return <LoadingMore loading />;
  if (!sponsors?.length) return null;

  return (
    <View style={style}>
      <SectionTitle title={t('home.partnersTitle')} />
      <TileCarousel
        items={sponsors.map((sponsor) => ({
          key: sponsor._id,
          title: sponsor.name,
          image: sponsor.image,
          sponsor,
        }))}
        onPressItem={(item) => onOpenPartner(item.sponsor)}
        hideCaptions
        tileSurface="background"
      />
    </View>
  );
}

PartnersBlock.displayName = 'PartnersBlock';
