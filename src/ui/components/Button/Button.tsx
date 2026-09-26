import { Image, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { ButtonProps } from './types';

/**
 * Pill button with a leading image. Also works as a selectable option:
 * pass `choosen` + `onChoose` to render it as a choice in a list.
 *
 * @example
 * <Button source={saveIcon} text={t('save')} onPress={save} />
 * <Button source={icon} text={label} choosen={isSelected} onChoose={select} />
 */
export function Button({
  source,
  text,
  disabled = false,
  onPress,
  onChoose,
  choosen = false,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: choosen }}
      disabled={disabled}
      onPress={onChoose ?? onPress}
      style={({ pressed }) => [
        styles.container(choosen),
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      <Image source={source} style={styles.image} />
      <Text
        variant="bodyLMedium"
        color={choosen ? 'primaryForeground' : 'foreground'}
        style={styles.text}
      >
        {text}
      </Text>
    </Pressable>
  );
}

Button.displayName = 'Button';

const styles = StyleSheet.create((theme, rt) => ({
  container: (choosen: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: rt.screen.width * 0.6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: choosen ? theme.colors.primary : theme.colors.background,
  }),
  pressed: {
    opacity: 0.2,
  },
  image: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(2.5),
  },
  text: {
    paddingVertical: theme.spacing(2.5),
    textAlign: 'center',
  },
}));
