import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon, Text } from '@/ui/components';

import type { LoyaltyLevel } from '@/types/api';

import type { ProfileCardProps } from './types';

const NEXT_LEVEL: Record<LoyaltyLevel, LoyaltyLevel | null> = {
  bronze: 'silver',
  silver: 'gold',
  gold: 'emerald',
  emerald: null,
};

/**
 * The fan at the top of the profile: photo (tap to change), name, edit and
 * loyalty progress.
 */
export function ProfileCard({
  name,
  photo,
  level,
  onEdit,
  onChangePhoto,
  photoUploading = false,
  style,
}: ProfileCardProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const next = level ? NEXT_LEVEL[level.level] : null;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('profile.changePhoto')}
          accessibilityState={{ busy: photoUploading }}
          disabled={!onChangePhoto || photoUploading}
          onPress={onChangePhoto}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Icon name="user" size={18} color={theme.colors.onBrand} />
            </View>
          )}
          {photoUploading ? (
            <View style={[styles.avatar, styles.avatarBusy]}>
              <ActivityIndicator color={theme.colors.onBrand} />
            </View>
          ) : onChangePhoto ? (
            <View style={styles.badge}>
              <Icon name="changeImage" size={10} color={theme.colors.onBrand} />
            </View>
          ) : null}
        </Pressable>
        <Text variant="bodyMMedium" numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        {/* The check icon is already a ticked circle. */}
        <Icon
          name="check"
          size={16}
          color={theme.colors.brand}
          accessibilityLabel={t('profile.verified')}
        />
        <View style={styles.flex} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('profile.edit')}
          hitSlop={8}
          onPress={onEdit}
        >
          <Icon name="edit" size={18} color={theme.colors.foreground} />
        </Pressable>
      </View>
      {level ? (
        <View style={styles.level}>
          <View style={styles.row}>
            <Text variant="bodyXSMedium" style={styles.flex}>
              {t('fanCard.level', { level: t(`fanCard.${level.level}`) })}
            </Text>
            {next && level.nextLevelPoints ? (
              <Text variant="bodyXSMedium" color="mutedForeground">
                {t('fanCard.toNextLevel', {
                  level: t(`fanCard.${next}`),
                  points: level.points,
                  total: level.nextLevelPoints,
                })}
              </Text>
            ) : null}
          </View>
          {level.nextLevelPoints ? (
            <View style={styles.track}>
              <View
                style={styles.fill(
                  Math.min(level.points / level.nextLevelPoints, 1),
                )}
              />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

ProfileCard.displayName = 'ProfileCard';

const styles = StyleSheet.create((theme) => ({
  card: {
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mintSurface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    borderRadius: theme.radius.full,
  },
  avatarBusy: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.shadow,
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: theme.radius.full,
    borderColor: theme.colors.mintSurface,
    backgroundColor: theme.colors.brand,
  },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand,
  },
  name: {
    flexShrink: 1,
  },
  flex: {
    flex: 1,
  },
  level: {
    gap: theme.spacing(1.5),
    paddingTop: theme.spacing(3),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  track: {
    height: 2,
    backgroundColor: theme.colors.border,
  },
  fill: (share: number) => ({
    width: `${share * 100}%`,
    height: 2,
    backgroundColor: theme.colors.brand,
  }),
}));
