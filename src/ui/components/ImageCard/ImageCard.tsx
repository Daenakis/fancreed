import { Image, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { ImageCardProps, ImageCardVariant } from './types';

/**
 * Image with a caption under it. `photo` is a tall full-bleed picture
 * (players), `tile` a small framed tile with the image inset (events,
 * challenges). Pressable only when `onPress` is set.
 *
 * @example
 * <ImageCard image={player.photo} title={player.name} subtitle="45%" />
 * <ImageCard variant="tile" image={event.image} title={event.name} textColor="background" onPress={open} />
 */
export function ImageCard({
  image,
  title,
  subtitle,
  variant = 'photo',
  onPress,
  textColor = 'foreground',
  style,
}: ImageCardProps) {
  const source = typeof image === 'string' ? { uri: image } : image;
  const label = [title, subtitle].filter(Boolean).join(', ');

  const content = (
    <>
      <View style={styles.frame(variant, !source)}>
        {source ? (
          <Image
            source={source}
            resizeMode="contain"
            style={styles.image(variant)}
          />
        ) : null}
      </View>
      {title || subtitle ? (
        <Text
          variant={variant === 'tile' ? 'bodyMSemibold' : 'bodySSemibold'}
          color={textColor}
          numberOfLines={variant === 'tile' ? 2 : undefined}
          style={styles.caption}
        >
          {title}
          {subtitle ? `${title ? '\n' : ''}${subtitle}` : null}
        </Text>
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View
        accessible
        accessibilityLabel={label}
        style={[styles.card(variant), style]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card(variant),
        pressed && styles.pressed,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

ImageCard.displayName = 'ImageCard';

const styles = StyleSheet.create((theme) => ({
  card: (variant: ImageCardVariant) => ({
    width: variant === 'tile' ? 100 : theme.spacing(28),
    alignItems: 'center',
  }),
  frame: (variant: ImageCardVariant, empty: boolean) =>
    variant === 'tile'
      ? {
          width: '100%',
          height: 130,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.translucentSurface,
        }
      : {
          width: '100%',
          height: 200,
          borderRadius: theme.radius.lg,
          overflow: 'hidden',
          backgroundColor: empty ? theme.colors.muted : undefined,
        },
  image: (variant: ImageCardVariant) =>
    variant === 'tile'
      ? { width: '80%', height: '80%', borderRadius: theme.radius.md }
      : { width: '100%', height: '100%' },
  caption: {
    maxWidth: '90%',
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
}));
