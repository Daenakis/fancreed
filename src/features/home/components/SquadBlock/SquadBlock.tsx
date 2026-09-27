import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  Carousel,
  ImageCard,
  LoadingMore,
  SectionTitle,
} from '@/ui/components';

import { useSquadQuery } from '@/hooks';

import type { SquadBlockProps } from './types';

/**
 * Home-screen line-up: swipe through the club's players; "Show more" opens
 * the centred player's page. Hidden when the squad is empty.
 */
export function SquadBlock({ onOpenPlayer, style }: SquadBlockProps) {
  const { t } = useTranslation();
  const { data: players, isPending } = useSquadQuery();
  const [index, setIndex] = useState(0);

  if (isPending) return <LoadingMore loading />;
  if (!players?.length) return null;

  const current = players[index];

  return (
    <View style={style}>
      <SectionTitle title={t('home.squadTitle')} />
      <Carousel
        data={players}
        itemWidthRatio={0.35}
        keyExtractor={(player) => player._id}
        onIndexChange={setIndex}
        style={styles.carousel}
        showIndicator={false}
        renderItem={(player, i) => (
          <ImageCard
            image={player.actualPhoto ?? player.photo}
            placeholderIcon="lion"
            title={player.actualName ?? player.name}
            textColor={i === index ? 'foreground' : 'mutedForeground'}
            style={styles.card}
          />
        )}
      />
      <Button
        size="xs"
        fullWidth
        backgroundColor="brand"
        textColor="onBrand"
        text={t('home.showMore')}
        style={styles.inset}
        disabled={!current}
        onPress={() => current && onOpenPlayer(current)}
      />
    </View>
  );
}

SquadBlock.displayName = 'SquadBlock';

const styles = StyleSheet.create((theme) => ({
  carousel: {
    marginBottom: theme.spacing(4),
  },
  inset: {
    marginHorizontal: theme.spacing(5),
  },
  card: {
    width: '100%',
  },
}));
