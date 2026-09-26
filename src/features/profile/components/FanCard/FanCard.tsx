import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import { BlockHeader, Button, Text } from '@/ui/components';
import type { ColorToken } from '@/ui/theme';

import type { FanCardFrontProps, FanCardProps, LoyaltyLevel } from './types';

const BACKGROUND = require('../../../../../assets/images/fan-card/background.png');
const BARCODE = require('../../../../../assets/images/fan-card/barcode.png');
const LEVEL_IMAGES: Record<LoyaltyLevel, number> = {
  bronze: require('../../../../../assets/images/fan-card/bronze.png'),
  silver: require('../../../../../assets/images/fan-card/silver.png'),
  gold: require('../../../../../assets/images/fan-card/gold.png'),
};
const LEVEL_COLORS: Record<LoyaltyLevel, ColorToken> = {
  bronze: 'loyaltyBronze',
  silver: 'loyaltySilver',
  gold: 'loyaltyGold',
};
const FLIP_MS = 500;

/**
 * The fan's ID card: photo, name, season and loyalty level on a dark card.
 * Until the profile is filled in it asks the fan to complete it.
 * `full` is the large landscape card that flips to a barcode on tap.
 */
export function FanCard({
  name,
  surname,
  photo,
  season,
  loyaltyLevel = 'bronze',
  variant = 'compact',
  title,
  onOpenProfile,
  style,
}: FanCardProps) {
  const { t } = useTranslation();
  const full = variant === 'full';
  const complete = !!(name && surname && photo);
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

  const front = complete ? (
    <FanCardFront
      name={name}
      surname={surname}
      photo={photo}
      season={season}
      level={loyaltyLevel}
      full={full}
      onOpenProfile={onOpenProfile}
    />
  ) : (
    <View style={styles.empty}>
      <Text variant="h4Medium" color="onInverseSurface" style={styles.centered}>
        {t('fanCard.empty')}
      </Text>
      {onOpenProfile && !full ? (
        <Button
          variant="outline"
          text={t('fanCard.toProfile')}
          onPress={onOpenProfile}
          style={styles.profileButton}
        />
      ) : null}
    </View>
  );

  return (
    <View style={[styles.card(full), style]}>
      <Image
        source={BACKGROUND}
        resizeMode="contain"
        style={styles.background}
      />
      <BlockHeader title={title ?? t('fanCard.title')} />
      {full && complete ? (
        <Pressable
          accessibilityRole="button"
          accessibilityHint={t('fanCard.flipHint')}
          onPress={() => {
            flip.set(
              withTiming(flip.get() > 0.5 ? 0 : 1, { duration: FLIP_MS }),
            );
          }}
          style={styles.flipArea}
        >
          <Animated.View style={[styles.face, frontStyle]}>
            {front}
          </Animated.View>
          <Animated.View style={[styles.face, styles.backFace, backStyle]}>
            <Image
              source={BARCODE}
              resizeMode="contain"
              style={styles.barcode}
            />
          </Animated.View>
        </Pressable>
      ) : (
        <View style={styles.flipArea}>{front}</View>
      )}
    </View>
  );
}

FanCard.displayName = 'FanCard';

function FanCardFront({
  name,
  surname,
  photo,
  season,
  level,
  full,
  onOpenProfile,
}: FanCardFrontProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.front(full)}>
      <Pressable
        accessibilityRole={onOpenProfile && !full ? 'button' : 'image'}
        accessibilityLabel={`${name} ${surname}`}
        disabled={!onOpenProfile || full}
        onPress={onOpenProfile}
      >
        <Image
          source={{ uri: photo ?? undefined }}
          resizeMode="cover"
          style={styles.photo(full)}
        />
      </Pressable>
      <View style={styles.info}>
        <Text
          variant="h3Medium"
          color="onInverseSurface"
          style={styles.centered}
        >
          {name}
          {'\n'}
          {surname}
        </Text>
        <Text
          variant="h3Medium"
          color="onInverseSurface"
          style={styles.centered}
        >
          {t('fanCard.season')}
          {'\n'}
          {season}
        </Text>
      </View>
      <View style={styles.level}>
        <Image
          source={LEVEL_IMAGES[level]}
          resizeMode="contain"
          style={styles.levelImage(full)}
        />
        <Text
          variant="h3Medium"
          color={LEVEL_COLORS[level]}
          style={styles.centered}
        >
          {t('fanCard.level', { level: t(`fanCard.${level}`) })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: (full: boolean) => ({
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.colors.inverseSurface,
    ...(full
      ? {
          flex: 1,
          width: '90%',
          alignSelf: 'center',
          borderWidth: 1,
          borderColor: theme.colors.primary,
          borderRadius: theme.radius.xl,
        }
      : { width: '100%', height: 250 }),
  }),
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 200,
  },
  flipArea: {
    flex: 1,
    alignSelf: 'stretch',
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  backFace: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  front: (full: boolean) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: full ? '10%' : 0,
  }),
  photo: (full: boolean) => ({
    width: full ? 210 : 110,
    height: full ? 280 : 160,
    borderRadius: theme.radius.md,
  }),
  info: {
    flex: 0.75,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing(4),
  },
  level: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelImage: (full: boolean) => ({
    width: full ? 150 : 90,
    height: full ? 180 : 120,
  }),
  barcode: {
    width: 300,
    height: 100,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing(4),
  },
  profileButton: {
    marginTop: theme.spacing(5),
  },
  centered: {
    textAlign: 'center',
  },
}));
