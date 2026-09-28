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
 * The club's players to swipe through; the button acts on the centred one
 * ("Show more" by default, e.g. "Make favourite" via `renderAction`).
 * `boxed` puts it on a light-green card. Hidden when the squad is empty.
 */
export function SquadBlock({
  onOpenPlayer,
  title,
  initialPlayerId,
  renderAction,
  boxed = false,
  style,
}: SquadBlockProps) {
  const { t } = useTranslation();
  const { data: players, isPending } = useSquadQuery();
  const initialIndex = Math.max(
    0,
    players?.findIndex((p) => String(p._id) === initialPlayerId) ?? 0,
  );
  const [picked, setIndex] = useState<number | null>(null);
  const index = picked ?? initialIndex;

  if (isPending) return <LoadingMore loading />;
  if (!players?.length) return null;

  const current = players[index];

  return (
    <View style={[boxed && styles.box, style]}>
      <SectionTitle
        title={title ?? t('home.squadTitle')}
        variant={boxed ? 'h4Medium' : undefined}
        style={boxed ? styles.boxTitle : undefined}
      />
      <Carousel
        data={players}
        initialIndex={initialIndex}
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
      <View style={boxed ? styles.boxAction : styles.inset}>
        {renderAction && current ? (
          renderAction(current)
        ) : (
          <Button
            size="xs"
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t('home.showMore')}
            disabled={!current || !onOpenPlayer}
            onPress={() => current && onOpenPlayer?.(current)}
          />
        )}
      </View>
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
  box: {
    overflow: 'hidden',
    paddingVertical: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mintSurface,
  },
  boxTitle: {
    paddingHorizontal: theme.spacing(3),
  },
  boxAction: {
    marginHorizontal: theme.spacing(3),
  },
  card: {
    width: '100%',
  },
}));
