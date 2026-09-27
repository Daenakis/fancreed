import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  BlockHeader,
  Button,
  Carousel,
  ImageCard,
  LoadingMore,
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
    <View style={[styles.container, style]}>
      <BlockHeader title={t('home.squadTitle')} />
      <Carousel
        data={players}
        itemWidthRatio={0.35}
        keyExtractor={(player) => player._id}
        onIndexChange={setIndex}
        style={styles.carousel}
        renderItem={(player) => (
          <ImageCard
            image={player.actualPhoto ?? player.photo}
            title={player.actualName ?? player.name}
            style={styles.card}
          />
        )}
      />
      <Button
        size="sm"
        text={t('home.showMore')}
        disabled={!current?.ruhLink}
        onPress={() => current && onOpenPlayer(current)}
      />
    </View>
  );
}

SquadBlock.displayName = 'SquadBlock';

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    paddingBottom: theme.spacing(4),
  },
  carousel: {
    alignSelf: 'stretch',
    marginVertical: theme.spacing(3),
  },
  card: {
    width: '100%',
  },
}));
