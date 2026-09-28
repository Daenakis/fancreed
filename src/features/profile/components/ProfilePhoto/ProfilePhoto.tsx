import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon, RemoteImage } from '@/ui/components';

import type { ProfilePhotoProps } from './types';

/** The photo is this share of the screen width. */
const WIDTH_SHARE = 0.35;

/**
 * The fan's photo on the edit screen: a large circle with a camera badge in
 * the bottom-right corner — tap to pick a new photo.
 */
export function ProfilePhoto({
  photo,
  uploading = false,
  onPress,
  style,
}: ProfilePhotoProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { width } = useWindowDimensions();
  const size = Math.round(width * WIDTH_SHARE);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('profile.changePhoto')}
      accessibilityState={{ busy: uploading }}
      disabled={uploading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root(size),
        pressed && styles.pressed,
        style,
      ]}
    >
      {photo ? (
        <RemoteImage source={{ uri: photo }} style={styles.circle(size)} />
      ) : (
        <View style={[styles.circle(size), styles.empty]}>
          <Icon name="user" size={size * 0.4} color={theme.colors.onBrand} />
        </View>
      )}
      {uploading ? (
        <View style={[styles.circle(size), styles.busy]}>
          <ActivityIndicator color={theme.colors.onBrand} />
        </View>
      ) : null}
      {/* On the circle's edge at 45°, like a phone's photo badge. */}
      <View style={styles.badge(size)}>
        <Icon name="changeImage" size={18} color={theme.colors.onBrand} />
      </View>
    </Pressable>
  );
}

ProfilePhoto.displayName = 'ProfilePhoto';

const BADGE = 36;

const styles = StyleSheet.create((theme) => ({
  root: (size: number) => ({
    width: size,
    height: size,
    alignSelf: 'center',
  }),
  circle: (size: number) => ({
    width: size,
    height: size,
    borderRadius: theme.radius.full,
  }),
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand,
  },
  busy: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.shadow,
  },
  // Centre on the circle at 45°: r − r·cos45° from the corner, minus half
  // the badge.
  badge: (size: number) => {
    const inset = (size / 2) * (1 - Math.SQRT1_2) - BADGE / 2;
    return {
      position: 'absolute',
      right: inset,
      bottom: inset,
      width: BADGE,
      height: BADGE,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      borderWidth: 3,
      borderColor: theme.colors.background,
      backgroundColor: theme.colors.brand,
    };
  },
  pressed: {
    opacity: 0.8,
  },
}));
