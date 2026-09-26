import { Image, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { PlayerItemProps } from './types';

/**
 * Player card for vote / prediction carousels: photo, name and, once the
 * results are visible, the player's vote share.
 *
 * @example
 * <PlayerItem image={player.photo} name={player.name} percent={vote.percent} />
 */
export function PlayerItem({
  image,
  name,
  percent,
  onPress,
  textColor = 'foreground',
  style,
}: PlayerItemProps) {
  const label = [name, percent !== undefined ? `${percent}%` : null]
    .filter(Boolean)
    .join(', ');
  const content = (
    <>
      {image ? (
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <Text variant="bodySSemibold" color={textColor} style={styles.text}>
        {name}
        {percent !== undefined ? `\n${percent}%` : null}
      </Text>
    </>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={label} style={[styles.card, style]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      {content}
    </Pressable>
  );
}

PlayerItem.displayName = 'PlayerItem';

const styles = StyleSheet.create((theme) => ({
  card: {
    width: theme.spacing(28),
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.radius.lg,
  },
  placeholder: {
    backgroundColor: theme.colors.muted,
  },
  text: {
    maxWidth: '80%',
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
}));
