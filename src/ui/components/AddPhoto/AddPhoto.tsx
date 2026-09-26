import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { AddPhotoProps } from './types';

/**
 * Portrait photo tile for profile / club forms: the photo (or a placeholder),
 * a "Photo" caption with a camera icon, and a spinner while uploading.
 * Picking and uploading the image is up to the caller.
 */
export function AddPhoto({
  onPress,
  photo,
  disabled = false,
  uploading = false,
  style,
}: AddPhotoProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole={disabled ? 'image' : 'button'}
      accessibilityLabel={
        disabled ? t('photo.label') : t(photo ? 'photo.change' : 'photo.add')
      }
      accessibilityState={{ disabled, busy: uploading }}
      disabled={disabled || uploading}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed, style]}
    >
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} />
      ) : (
        <Icon name="user" size={64} color={theme.colors.mutedForeground} />
      )}
      <View style={styles.caption}>
        <Text variant="h4Regular">{t('photo.label')}</Text>
        {disabled ? null : (
          <Icon name="changeImage" size={20} style={styles.camera} />
        )}
      </View>
      {uploading ? (
        <View style={styles.overlay}>
          <ActivityIndicator color={theme.colors.primaryForeground} />
        </View>
      ) : null}
    </Pressable>
  );
}

AddPhoto.displayName = 'AddPhoto';

const styles = StyleSheet.create((theme) => ({
  tile: {
    width: 130,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.muted,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
  },
  caption: {
    position: 'absolute',
    bottom: theme.spacing(1),
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    position: 'absolute',
    right: theme.spacing(3),
  },
  // Tint keeps the spinner visible over any photo.
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.shadow,
  },
  pressed: {
    opacity: 0.7,
  },
}));
