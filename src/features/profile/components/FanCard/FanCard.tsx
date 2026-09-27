import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button, Icon, Text } from '@/ui/components';

import type { FanCardFrontProps, FanCardProps, LoyaltyLevel } from './types';

const BARCODE = require('../../../../../assets/images/fan-card/barcode.png');
const NEXT_LEVEL: Record<LoyaltyLevel, LoyaltyLevel | null> = {
  bronze: 'silver',
  silver: 'gold',
  gold: null,
};
const FLIP_MS = 500;

/**
 * The fan's ID card on a metallic background: photo, name, season, loyalty
 * level with the progress to the next one. Until the profile has a name it
 * asks the fan to complete it. `full` is the large landscape card that flips
 * to a barcode on tap.
 */
export function FanCard({
  name,
  surname,
  photo,
  season,
  loyaltyLevel = 'bronze',
  points,
  nextLevelPoints,
  cardId,
  variant = 'compact',
  onPress,
  onOpenProfile,
  style,
}: FanCardProps) {
  const { t } = useTranslation();
  const full = variant === 'full';
  const complete = !!(name && surname);
  const flip = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
    ],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
    ],
  }));

  if (!complete) {
    return (
      <View style={[styles.card(full), styles.empty, style]}>
        <Text variant="bodyLMedium" color="onFanCard" style={styles.centered}>
          {t('fanCard.empty')}
        </Text>
        {onOpenProfile ? (
          <Button
            variant="outline"
            size="sm"
            text={t('fanCard.toProfile')}
            onPress={onOpenProfile}
          />
        ) : null}
      </View>
    );
  }

  const front = (
    <FanCardFront
      name={name}
      surname={surname}
      photo={photo}
      season={season}
      points={points}
      nextLevelPoints={nextLevelPoints}
      level={loyaltyLevel}
      full={full}
    />
  );

  if (!full) {
    return (
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${name} ${surname}`}
        disabled={!onPress}
        onPress={onPress}
        style={[styles.card(false), style]}
      >
        {front}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name} ${surname}`}
      accessibilityHint={t('fanCard.flipHint')}
      onPress={() => {
        flip.set(withTiming(flip.get() > 0.5 ? 0 : 1, { duration: FLIP_MS }));
      }}
      style={[styles.flipArea, style]}
    >
      <Animated.View style={[styles.card(true), styles.face, frontStyle]}>
        {front}
      </Animated.View>
      <Animated.View
        style={[styles.card(true), styles.face, styles.back, backStyle]}
      >
        {/* TODO: static picture until a barcode generator is approved. */}
        <Image
          source={BARCODE}
          resizeMode="contain"
          accessibilityLabel={
            cardId ? t('fanCard.cardId', { id: cardId }) : undefined
          }
          style={styles.barcode}
        />
      </Animated.View>
    </Pressable>
  );
}

FanCard.displayName = 'FanCard';

function FanCardFront({
  name,
  surname,
  photo,
  season,
  points,
  nextLevelPoints,
  level,
  full,
}: FanCardFrontProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const next = NEXT_LEVEL[level];
  const showProgress = next && points != null && !!nextLevelPoints;

  return (
    <>
      <View style={styles.tab}>
        <Text variant={full ? 'bodyLRegular' : 'bodyMRegular'} color="onBrand">
          {t('fanCard.level', { level: t(`fanCard.${level}`) })}
        </Text>
      </View>
      <View style={styles.fan}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            resizeMode="cover"
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarEmpty]}>
            <Icon name="user" size={20} color={theme.colors.onBrand} />
          </View>
        )}
        <View style={styles.fanText}>
          <Text variant="bodyMMedium" color="onFanCard" numberOfLines={1}>
            {name} {surname}
          </Text>
          <Text variant="bodySRegular" color="onFanCard">
            {t('fanCard.season', { season })}
          </Text>
        </View>
      </View>
      <Icon
        name="lion"
        size={full ? 150 : 100}
        color={theme.colors.fanCardInk}
        style={styles.lion(full)}
      />
      {showProgress ? (
        <View style={styles.progress}>
          <Text variant="bodySRegular" color="onFanCard">
            {t('fanCard.toNextLevel', {
              level: t(`fanCard.${next}`),
              points,
              total: nextLevelPoints,
            })}
          </Text>
          <View style={styles.track}>
            <View style={styles.fill(Math.min(points / nextLevelPoints, 1))} />
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: (full: boolean) => ({
    overflow: 'hidden',
    borderRadius: theme.radius.lg,
    padding: theme.spacing(3),
    ...(full ? { flex: 1 } : { height: 150 }),
    experimental_backgroundImage: `linear-gradient(90deg, ${theme.colors.fanCardEdge} 0%, ${theme.colors.fanCardLight} 35%, ${theme.colors.fanCardWarm} 65%, ${theme.colors.fanCardShade} 100%)`,
  }),
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(3),
  },
  centered: {
    textAlign: 'center',
  },
  flipArea: {
    flex: 1,
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  barcode: {
    width: 300,
    height: 80,
  },
  tab: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1),
    borderBottomLeftRadius: theme.radius.lg,
    backgroundColor: theme.colors.fanCardInk,
  },
  fan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    maxWidth: '65%',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    borderRadius: theme.radius.full,
  },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.fanCardInk,
  },
  fanText: {
    flexShrink: 1,
    gap: theme.spacing(0.5),
  },
  lion: (full: boolean) => ({
    position: 'absolute',
    right: full ? theme.spacing(8) : theme.spacing(4),
    bottom: theme.spacing(3),
  }),
  progress: {
    position: 'absolute',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
    width: '55%',
    gap: theme.spacing(1),
  },
  track: {
    height: 2,
    backgroundColor: theme.colors.translucentSurface,
  },
  fill: (share: number) => ({
    width: `${share * 100}%`,
    height: 2,
    backgroundColor: theme.colors.onFanCard,
  }),
}));
